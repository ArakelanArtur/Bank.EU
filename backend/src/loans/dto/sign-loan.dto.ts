import { IsString } from 'class-validator';

export class SignLoanDto {
  @IsString()
  otpCode: string;
}
