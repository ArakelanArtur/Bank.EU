import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '../common/config/app-config.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): JwtModuleOptions => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: config.jwtExpiresIn as any },
      }),
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AdminJwtStrategy],
  exports: [JwtModule, PassportModule, JwtStrategy, AdminJwtStrategy],
})
export class AuthModule {}
