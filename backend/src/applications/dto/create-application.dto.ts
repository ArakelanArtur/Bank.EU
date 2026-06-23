import { IsString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { UserType, ApplicationSource } from '@prisma/client';

export class CreateApplicationDto {
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsNumber()
  @Min(500)
  @Max(50000)
  amount: number;

  @IsNumber()
  @Min(7)
  @Max(90)
  termDays: number;

  @IsEnum(UserType)
  applicantType: UserType;

  @IsEnum(ApplicationSource)
  source: ApplicationSource;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;
}
