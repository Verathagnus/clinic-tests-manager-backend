// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller'; // Ensure AuthController is imported
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // Use a strong secret in production
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}