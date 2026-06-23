import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        businessProfile: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAdminUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        businessProfile: true,
        applications: { orderBy: { createdAt: 'desc' } },
        loans: {
          include: {
            paymentSchedule: { orderBy: { installmentNumber: 'asc' } },
          },
          orderBy: { createdAt: 'desc' },
        },
        paymentRequests: { orderBy: { createdAt: 'desc' } },
        notifications: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAllAdmin({ search }: { search?: string }) {
    return this.prisma.user.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search } },
              { phone: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      include: { businessProfile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    return { deleted: true };
  }
}
