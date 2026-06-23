import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsString()
  loanId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  details?: string;
}
