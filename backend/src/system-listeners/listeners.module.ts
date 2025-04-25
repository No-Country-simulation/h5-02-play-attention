import { Module } from '@nestjs/common';
import { UserListener } from './user.listener';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [UserListener],
})
export class ListenersModule {} 