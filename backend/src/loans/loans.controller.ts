import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { SignLoanDto } from './dto/sign-loan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Get()
  async listMy(@CurrentUser() user: any) {
    return this.loansService.findByUser(user.id);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.loansService.findById(id);
  }

  @Post(':id/request-sign-otp')
  async requestSignOtp(@Param('id') id: string, @CurrentUser() user: any) {
    return this.loansService.requestSignOtp(id, user.id, user.phone);
  }

  @Post(':id/sign')
  async signLoan(
    @Param('id') id: string,
    @Body() dto: SignLoanDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.loansService.signLoan(id, user.id, dto.otpCode, ip, userAgent);
  }
}
