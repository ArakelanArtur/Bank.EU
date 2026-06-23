import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { IsString, MinLength, IsOptional, IsIn } from 'class-validator';

class RegisterDto {
  @IsString()
  phone: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsIn(['INDIVIDUAL', 'BUSINESS'])
  userType?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  inn?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;
}

class LoginDto {
  @IsString()
  phone: string;

  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        fullName: dto.fullName,
        email: dto.email || null,
        passwordHash,
        userType: (dto.userType as any) || 'INDIVIDUAL',
        isVerified: true,
        ...(dto.userType === 'BUSINESS'
          ? {
              businessProfile: {
                create: {
                  companyName: dto.companyName || '',
                  registrationNumber: dto.inn || '',
                  contactPerson: dto.contactPerson || dto.fullName,
                },
              },
            }
          : {}),
      },
    });

    return { message: 'Registration successful', user: { id: user.id, phone: user.phone, fullName: user.fullName } };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      userType: user.userType,
    });

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
      },
    };
  }
}
