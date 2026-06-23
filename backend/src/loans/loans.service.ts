import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { AppConfigService } from '../common/config/app-config.service';

@Injectable()
export class LoansService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: AppConfigService,
  ) {}

  async findByUser(userId: string) {
    return this.prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { paymentSchedule: { orderBy: { installmentNumber: 'asc' } } },
    });
  }

  async findById(id: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        paymentSchedule: { orderBy: { installmentNumber: 'asc' } },
        paymentRequests: { orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { effectiveDate: 'desc' } },
      },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
  }

  async requestSignOtp(loanId: string, userId: string, phone: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.userId !== userId) throw new NotFoundException('Loan not found');
    if (loan.status !== 'PENDING_SIGNATURE') {
      throw new BadRequestException('Loan is not pending signature');
    }

    const mockCode = '0000';
    const expiresAt = new Date(Date.now() + this.config.otpTtlMinutes * 60 * 1000);

    await this.prisma.otpSession.create({
      data: {
        phone,
        purpose: 'LOAN_SIGN',
        code: mockCode,
        expiresAt,
        relatedUserId: userId,
        relatedLoanId: loanId,
      },
    });

    return { message: 'OTP sent', hint: `Mock OTP code: ${mockCode}` };
  }

  async signLoan(loanId: string, userId: string, otpCode: string, ip: string, userAgent: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.userId !== userId) throw new NotFoundException('Loan not found');
    if (loan.status !== 'PENDING_SIGNATURE') {
      throw new BadRequestException('Loan is not pending signature');
    }

    if (!/^\d{4}$/.test(otpCode)) {
      throw new BadRequestException('Invalid OTP format');
    }

    const session = await this.prisma.otpSession.findFirst({
      where: {
        relatedLoanId: loanId,
        purpose: 'LOAN_SIGN',
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) {
      throw new BadRequestException('No OTP requested or OTP expired');
    }

    if (session.code !== otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    await this.prisma.otpSession.update({
      where: { id: session.id },
      data: { verifiedAt: new Date() },
    });

    const updated = await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'ACTIVE',
        signedAt: new Date(),
        signedIp: ip,
        signedUserAgent: userAgent,
        issuedAt: new Date(),
      },
    });

    await this.prisma.notification.create({
      data: {
        userId,
        type: 'LOAN_SIGNED',
        title: 'Loan signed',
        message: `Loan ${loan.loanNumber} has been signed and activated. Funds will be issued.`,
      },
    });

    return updated;
  }

  async findAllAdmin(filters?: { status?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    return this.prisma.loan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, phone: true, fullName: true } },
        paymentSchedule: { orderBy: { installmentNumber: 'asc' } },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException('Loan not found');

    const data: any = { status: status as any };
    if (status === 'CLOSED') {
      data.closedAt = new Date();

      await this.prisma.notification.create({
        data: {
          userId: loan.userId,
          type: 'LOAN_CLOSED',
          title: 'Loan closed',
          message: `Loan ${loan.loanNumber} has been closed.`,
        },
      });
    }

    return this.prisma.loan.update({ where: { id }, data });
  }
}
