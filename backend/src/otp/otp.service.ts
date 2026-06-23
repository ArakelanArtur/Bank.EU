import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { AppConfigService } from '../common/config/app-config.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: AppConfigService,
  ) {}

  async requestOtp(phone: string) {
    const mockCode = '0000';
    const expiresAt = new Date(Date.now() + this.config.otpTtlMinutes * 60 * 1000);

    await this.prisma.otpSession.create({
      data: {
        phone,
        purpose: 'LOGIN',
        code: mockCode,
        expiresAt,
      },
    });

    return { message: 'OTP sent to your phone', hint: `Mock OTP code: ${mockCode}` };
  }

  async verifyOtp(phone: string, code: string) {
    // Demo mode: any 4-digit code is valid
    if (!/^\d{4}$/.test(code)) {
      throw new UnauthorizedException('Invalid OTP format');
    }

    const session = await this.prisma.otpSession.findFirst({
      where: {
        phone,
        purpose: 'LOGIN',
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) {
      throw new UnauthorizedException('No OTP requested or OTP expired');
    }

    await this.prisma.otpSession.update({
      where: { id: session.id },
      data: { verifiedAt: new Date() },
    });

    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone, userType: 'INDIVIDUAL', isVerified: true },
      });
    } else if (!user.isVerified) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    const token = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      userType: user.userType,
    });

    return { token, user: { id: user.id, phone: user.phone } };
  }
}
