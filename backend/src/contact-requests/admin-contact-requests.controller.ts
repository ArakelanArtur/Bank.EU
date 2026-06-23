import { Controller, Get, UseGuards } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/contact-requests')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class AdminContactRequestsController {
  constructor(private contactRequestsService: ContactRequestsService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR')
  async listAll() {
    return this.contactRequestsService.findAllAdmin();
  }
}
