import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { UpdateLoanStatusDto } from './dto/update-loan-status.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/loans')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class AdminLoansController {
  constructor(private loansService: LoansService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR')
  async listAll(@Query('status') status?: string) {
    return this.loansService.findAllAdmin({ status });
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERATOR')
  async getById(@Param('id') id: string) {
    return this.loansService.findById(id);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'OPERATOR')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateLoanStatusDto) {
    return this.loansService.updateStatus(id, dto.status);
  }
}
