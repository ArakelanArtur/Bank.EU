import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-status.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin/applications')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class AdminApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR')
  async listAll(@Query('status') status?: string) {
    return this.applicationsService.findAllAdmin({ status });
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERATOR')
  async getById(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'OPERATOR')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() admin: any,
  ) {
    return this.applicationsService.updateStatus(id, dto.status, admin.id, dto.note);
  }

  @Post(':id/notes')
  @Roles('ADMIN', 'OPERATOR')
  async addNote(
    @Param('id') id: string,
    @Body() dto: CreateNoteDto,
    @CurrentUser() admin: any,
  ) {
    return this.applicationsService.addNote(id, admin.id, dto.content);
  }
}
