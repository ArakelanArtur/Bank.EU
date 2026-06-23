import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { calculateLoanTerms, roundCurrency } from '../common/finance/loan-calculator';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPaymentRequest(userId: string, loanId: string, amount: number, reference?: string, details?: string, receiptFileName?: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.userId !== userId) throw new NotFoundException('Loan not found');

    const ref = reference || `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return this.prisma.paymentRequest.create({
      data: { loanId, userId, amount, reference: ref, details, receiptFileName, status: 'PENDING_REVIEW' },
    });
  }

  async findPaymentRequestsByUser(userId: string) {
    return this.prisma.paymentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { loan: { select: { loanNumber: true } } },
    });
  }

  async findAllPaymentRequestsAdmin(filters?: { status?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    return this.prisma.paymentRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, phone: true, fullName: true } },
        loan: { select: { loanNumber: true } },
      },
    });
  }

  async reviewPaymentRequest(id: string, status: string, adminUserId: string) {
    const pr = await this.prisma.paymentRequest.findUnique({ where: { id } });
    if (!pr) throw new NotFoundException('Payment request not found');

    const updated = await this.prisma.paymentRequest.update({
      where: { id },
      data: { status: status as any, reviewedAt: new Date(), reviewedByAdminId: adminUserId },
    });

    await this.prisma.notification.create({
      data: {
        userId: pr.userId,
        type: 'PAYMENT_REQUEST_UPDATED',
        title: 'Payment request updated',
        message: `Payment request for loan is now ${status}`,
      },
    });

    return updated;
  }

  async recordPayment(adminUserId: string, loanId: string, amount: number, reference: string, effectiveDate: string, paymentRequestId?: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');

    const payment = await this.prisma.payment.create({
      data: {
        loanId,
        paymentRequestId,
        amount,
        reference,
        effectiveDate: new Date(effectiveDate),
        recordedByAdminId: adminUserId,
      },
    });

    await this.applyPaymentToSchedule(loanId, amount);

    await this.prisma.notification.create({
      data: {
        userId: loan.userId,
        type: 'PAYMENT_CONFIRMED',
        title: 'Payment confirmed',
        message: `Payment of ${amount} confirmed for loan ${loan.loanNumber}`,
      },
    });

    return payment;
  }

  private async applyPaymentToSchedule(loanId: string, amount: number) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) return;

    const items = await this.prisma.paymentScheduleItem.findMany({
      where: { loanId, status: { in: ['PENDING', 'PARTIAL'] } },
      orderBy: { installmentNumber: 'asc' },
    });

    if (items.length === 0) return;

    let remaining = amount;
    let paidCount = 0;
    let partialItemId: string | null = null;
    let partialOriginalPrincipal = 0;
    let partialOriginalInterest = 0;
    let partialPaidAmount = 0;

    for (const item of items) {
      if (remaining <= 0) break;

      const amountDue = Number(item.amountDue);

      if (remaining >= amountDue) {
        await this.prisma.paymentScheduleItem.update({
          where: { id: item.id },
          data: { status: 'PAID', paidAt: new Date() },
        });
        remaining = roundCurrency(remaining - amountDue);
        paidCount++;
      } else {
        partialItemId = item.id;
        partialOriginalPrincipal = Number(item.principalPart);
        partialOriginalInterest = Number(item.interestPart);
        partialPaidAmount = remaining;

        const newAmountDue = roundCurrency(amountDue - remaining);
        await this.prisma.paymentScheduleItem.update({
          where: { id: item.id },
          data: { amountDue: newAmountDue, status: 'PARTIAL' },
        });
        remaining = 0;
      }
    }

    const pendingItems = await this.prisma.paymentScheduleItem.count({
      where: { loanId, status: { not: 'PAID' } },
    });

    if (pendingItems === 0) {
      await this.prisma.loan.update({
        where: { id: loanId },
        data: { status: 'CLOSED', closedAt: new Date() },
      });

      await this.prisma.notification.create({
        data: {
          userId: loan.userId,
          type: 'LOAN_CLOSED',
          title: 'Loan closed',
          message: `Loan has been fully paid and closed.`,
        },
      });

      return;
    }

    if (paidCount > 0) {
      await this.recalculateSchedule(loanId, partialItemId, partialOriginalPrincipal, partialOriginalInterest, partialPaidAmount);
    }
  }

  private async recalculateSchedule(
    loanId: string,
    partialItemId: string | null,
    partialOriginalPrincipal: number,
    partialOriginalInterest: number,
    partialPaidAmount: number,
  ) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) return;

    const remainingItems = await this.prisma.paymentScheduleItem.findMany({
      where: { loanId, status: { in: ['PENDING', 'PARTIAL'] } },
      orderBy: { installmentNumber: 'asc' },
    });

    if (remainingItems.length === 0) return;

    const dailyRate = Number(loan.dailyRate);
    const remainingDays = remainingItems.length;

    let remainingPrincipal = 0;
    for (const item of remainingItems) {
      remainingPrincipal += Number(item.principalPart);
    }

    if (partialItemId) {
      const partialPaidPrincipal = Math.max(0, roundCurrency(partialPaidAmount - partialOriginalInterest));
      remainingPrincipal = roundCurrency(remainingPrincipal - partialPaidPrincipal);
    }

    if (remainingPrincipal <= 0) {
      for (const item of remainingItems) {
        await this.prisma.paymentScheduleItem.update({
          where: { id: item.id },
          data: { status: 'PAID', paidAt: new Date() },
        });
      }
      await this.prisma.loan.update({
        where: { id: loanId },
        data: { status: 'CLOSED', closedAt: new Date() },
      });

      await this.prisma.notification.create({
        data: {
          userId: loan.userId,
          type: 'LOAN_CLOSED',
          title: 'Loan closed',
          message: `Loan has been fully paid and closed.`,
        },
      });

      return;
    }

    const remainingItemIds = remainingItems.map(i => i.id);
    await this.prisma.paymentScheduleItem.deleteMany({
      where: { id: { in: remainingItemIds } },
    });

    const calc = calculateLoanTerms(remainingPrincipal, remainingDays, dailyRate);

    let outstandingBalance = remainingPrincipal;
    for (let i = 1; i <= remainingDays; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i);

      const interestPart = roundCurrency(outstandingBalance * dailyRate);
      let principalPart = roundCurrency(calc.annuityPayment - interestPart);
      if (principalPart > outstandingBalance) {
        principalPart = roundCurrency(outstandingBalance);
      }
      outstandingBalance = roundCurrency(outstandingBalance - principalPart);

      await this.prisma.paymentScheduleItem.create({
        data: {
          loanId,
          installmentNumber: i,
          dueDate,
          amountDue: roundCurrency(principalPart + interestPart),
          principalPart,
          interestPart,
          status: 'PENDING',
        },
      });
    }

    const newTotalRepayment = roundCurrency(calc.annuityPayment * remainingDays);
    await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        totalRepayment: newTotalRepayment,
        annuityPayment: calc.annuityPayment,
      },
    });
  }
}
