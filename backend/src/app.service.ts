import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'lumenbridge-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
