import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './common/config/app-config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ApplicationsModule } from './applications/applications.module';
import { LoansModule } from './loans/loans.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContactRequestsModule } from './contact-requests/contact-requests.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    OtpModule,
    AdminModule,
    UsersModule,
    ApplicationsModule,
    LoansModule,
    PaymentsModule,
    NotificationsModule,
    ContactRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
