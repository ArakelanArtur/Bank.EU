import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateContactRequestDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  attachmentName?: string;

  @IsBoolean()
  consentAccepted: boolean;
}
