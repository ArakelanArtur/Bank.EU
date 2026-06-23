import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get('PORT', 3001));
  }

  get frontendUrl(): string {
    return this.configService.get('FRONTEND_URL', 'http://localhost:3000');
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', 'change-me-in-local-dev');
  }

  get jwtExpiresIn(): string {
    return this.configService.get('JWT_EXPIRES_IN', '7d');
  }

  get otpTtlMinutes(): number {
    return Number(this.configService.get('OTP_TTL_MINUTES', 5));
  }
}
