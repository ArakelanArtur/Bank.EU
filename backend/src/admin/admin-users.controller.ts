import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/admin-users')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(private adminService: AdminService) {}

  @Get()
  @Roles('ADMIN')
  async listOperators() {
    return this.adminService.listOperators();
  }

  @Post()
  @Roles('ADMIN')
  async createOperator(@Body() dto: CreateOperatorDto) {
    return this.adminService.createOperator(dto.login, dto.password, dto.name);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteOperator(@Param('id') id: string) {
    return this.adminService.deleteOperator(id);
  }
}
