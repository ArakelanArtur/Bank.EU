import { IsString, MinLength } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;
}
