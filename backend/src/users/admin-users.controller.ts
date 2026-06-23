import { Controller, Get, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/users')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR')
  async listAll(@Query('search') search?: string) {
    return this.usersService.findAllAdmin({ search });
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERATOR')
  async getById(@Param('id') id: string) {
    return this.usersService.getAdminUserById(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
