import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { PaymentsService } from './payments.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payment-requests')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('receipt', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'payment-receipts'),
        filename: (_req, file, callback) => {
          const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${extname(file.originalname)}`;
          callback(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() dto: CreatePaymentRequestDto,
    @CurrentUser() user: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.paymentsService.createPaymentRequest(
      user.id,
      dto.loanId,
      dto.amount,
      dto.reference,
      dto.details,
      file?.filename,
    );
  }

  @Get()
  async listMy(@CurrentUser() user: any) {
    return this.paymentsService.findPaymentRequestsByUser(user.id);
  }
}
