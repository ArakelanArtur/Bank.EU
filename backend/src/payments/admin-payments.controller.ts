import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ReviewPaymentRequestDto } from './dto/review-payment-request.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class AdminPaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('payment-requests')
  @Roles('ADMIN', 'OPERATOR')
  async listPaymentRequests(@Query('status') status?: string) {
    return this.paymentsService.findAllPaymentRequestsAdmin({ status });
  }

  @Patch('payment-requests/:id/review')
  @Roles('ADMIN', 'OPERATOR')
  async reviewPaymentRequest(
    @Param('id') id: string,
    @Body() dto: ReviewPaymentRequestDto,
    @CurrentUser() admin: any,
  ) {
    return this.paymentsService.reviewPaymentRequest(id, dto.status, admin.id);
  }

  @Post('payments')
  @Roles('ADMIN')
  async recordPayment(@Body() dto: RecordPaymentDto, @CurrentUser() admin: any) {
    return this.paymentsService.recordPayment(admin.id, dto.loanId, dto.amount, dto.reference, dto.effectiveDate, dto.paymentRequestId);
  }
}
