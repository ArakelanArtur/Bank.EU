import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin/auth')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto.login, dto.password);
  }

  @Get('me')
  @UseGuards(AdminJwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.adminService.getProfile(user.id);
  }
}
