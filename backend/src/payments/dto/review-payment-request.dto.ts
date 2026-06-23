import { IsEnum } from 'class-validator';
import { PaymentRequestStatus } from '@prisma/client';

export class ReviewPaymentRequestDto {
  @IsEnum(PaymentRequestStatus)
  status: PaymentRequestStatus;
}
