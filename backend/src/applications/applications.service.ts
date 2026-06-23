import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DEFAULT_DAILY_RATE, calculateLoanTerms } from '../common/finance/loan-calculator';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  private generateNumber(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `APP-${ts}-${rand}`;
  }

  async create(dto: CreateApplicationDto, userId?: string) {
    if (!userId) {
      let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (!user) {
        user = await this.prisma.user.create({
          data: { phone: dto.phone, userType: dto.applicantType, isVerified: false },
        });
      }
      userId = user.id;
    }

    const calc = calculateLoanTerms(dto.amount, dto.termDays, DEFAULT_DAILY_RATE);

    const application = await this.prisma.loanApplication.create({
      data: {
        applicationNumber: this.generateNumber(),
        userId,
        applicantType: dto.applicantType,
        amount: dto.amount,
        termDays: dto.termDays,
        dailyRate: DEFAULT_DAILY_RATE,
        status: 'NEW',
        source: dto.source,
        phone: dto.phone,
        email: dto.email,
        fullName: dto.fullName,
        companyName: dto.companyName,
        registrationNumber: dto.registrationNumber,
      },
    });

    return { ...application, calculatedPayment: calc.annuityPayment, calculatedTotal: calc.totalRepayment };
  }

  async findByUser(userId: string) {
    return this.prisma.loanApplication.findMany({
      where: { userId },
      include: { loan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const app = await this.prisma.loanApplication.findUnique({
      where: { id },
      include: {
        notes: { include: { adminUser: { select: { name: true } } } },
        loan: true,
      },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async findAllAdmin(filters?: { status?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    return this.prisma.loanApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, phone: true, fullName: true } } },
    });
  }

  async updateStatus(id: string, status: string, adminUserId: string, note?: string) {
    const app = await this.prisma.loanApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');

    const updated = await this.prisma.loanApplication.update({
      where: { id },
      data: { status: status as any },
    });

    if (note) {
      await this.prisma.applicationNote.create({
        data: { applicationId: id, adminUserId, content: note },
      });
    }

    await this.prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'APPLICATION_STATUS_CHANGED',
        title: 'Application status updated',
        message: `Application ${app.applicationNumber} is now ${status}`,
      },
    });

    if (status === 'APPROVED') {
      await this.createLoanFromApplication(app, adminUserId);
    }

    return updated;
  }

  private async createLoanFromApplication(app: any, adminUserId: string) {
    const calc = calculateLoanTerms(Number(app.amount), app.termDays, Number(app.dailyRate));
    const loanNumber = `LN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const loan = await this.prisma.loan.create({
      data: {
        loanNumber,
        applicationId: app.id,
        userId: app.userId,
        principalAmount: app.amount,
        termDays: app.termDays,
        dailyRate: app.dailyRate,
        annuityPayment: calc.annuityPayment,
        totalRepayment: calc.totalRepayment,
        status: 'PENDING_SIGNATURE',
      },
    });

    await this.generatePaymentSchedule(loan.id, Number(app.amount), Number(app.dailyRate), app.termDays, calc.annuityPayment);

    await this.prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'LOAN_APPROVED',
        title: 'Loan approved',
        message: `Loan ${loanNumber} has been approved. Please sign it to receive funds.`,
      },
    });

    return loan;
  }

  private async generatePaymentSchedule(loanId: string, principal: number, dailyRate: number, termDays: number, annuityPayment: number) {
    const items: any[] = [];
    let outstandingBalance = principal;

    for (let i = 1; i <= termDays; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i);

      const interestPart = Math.round(outstandingBalance * dailyRate * 100) / 100;
      let principalPart = Math.round((annuityPayment - interestPart) * 100) / 100;
      if (principalPart > outstandingBalance) {
        principalPart = Math.round(outstandingBalance * 100) / 100;
      }
      outstandingBalance = Math.round((outstandingBalance - principalPart) * 100) / 100;

      items.push({
        loanId,
        installmentNumber: i,
        dueDate,
        amountDue: principalPart + interestPart,
        principalPart,
        interestPart,
        status: 'PENDING',
      });
    }

    if (items.length > 0) {
      await this.prisma.paymentScheduleItem.createMany({ data: items });
    }
  }

  async addNote(applicationId: string, adminUserId: string, content: string) {
    const app = await this.prisma.loanApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');

    return this.prisma.applicationNote.create({
      data: { applicationId, adminUserId, content },
      include: { adminUser: { select: { name: true } } },
    });
  }
}
