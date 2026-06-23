import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/notifications')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class AdminNotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR')
  async listAll() {
    return this.notificationsService.findAllAdmin();
  }

  @Post()
  @Roles('ADMIN', 'OPERATOR')
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createForUser(dto.userId, dto.type, dto.title, dto.message);
  }
}
