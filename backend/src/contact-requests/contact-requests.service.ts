import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ContactRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; phone?: string; message: string; attachmentName?: string; consentAccepted: boolean }) {
    return this.prisma.contactRequest.create({ data });
  }

  async findAllAdmin() {
    return this.prisma.contactRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
