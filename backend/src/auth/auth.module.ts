import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';

@Global()
@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    TokenModule,
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
