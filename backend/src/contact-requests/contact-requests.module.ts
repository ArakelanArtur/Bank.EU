import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContactRequestsController } from './contact-requests.controller';
import { AdminContactRequestsController } from './admin-contact-requests.controller';
import { ContactRequestsService } from './contact-requests.service';

@Module({
  imports: [AuthModule],
  controllers: [ContactRequestsController, AdminContactRequestsController],
  providers: [ContactRequestsService],
})
export class ContactRequestsModule {}
