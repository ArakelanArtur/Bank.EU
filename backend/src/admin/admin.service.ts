import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(login: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { login } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { sub: admin.id, login: admin.login, role: admin.role },
      { expiresIn: '24h' },
    );

    return {
      token,
      admin: { id: admin.id, login: admin.login, role: admin.role, name: admin.name },
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id: adminId } });
    if (!admin) throw new UnauthorizedException();
    return { id: admin.id, login: admin.login, role: admin.role, name: admin.name };
  }

  async listOperators() {
    return this.prisma.adminUser.findMany({
      where: { role: 'OPERATOR' },
      select: { id: true, login: true, name: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOperator(login: string, password: string, name: string) {
    const existing = await this.prisma.adminUser.findUnique({ where: { login } });
    if (existing) {
      throw new ConflictException('Login already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.adminUser.create({
      data: { login, passwordHash, name, role: 'OPERATOR', isActive: true },
      select: { id: true, login: true, name: true, role: true, isActive: true, createdAt: true },
    });
  }

  async deleteOperator(id: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Operator not found');
    if (admin.role !== 'OPERATOR') throw new UnauthorizedException('Can only delete operators');

    await this.prisma.adminUser.delete({ where: { id } });
    return { deleted: true };
  }
}
