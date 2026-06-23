import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class RecordPaymentDto {
  @IsString()
  loanId: string;

  @IsOptional()
  @IsString()
  paymentRequestId?: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  reference: string;

  @IsDateString()
  effectiveDate: string;
}
