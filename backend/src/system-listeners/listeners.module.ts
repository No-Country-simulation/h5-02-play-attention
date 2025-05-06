import { Module } from '@nestjs/common';
import { UserListener } from './user.listener';
import { MailModule } from '../mail/mail.module';
import { LeadCreatedListener } from './lead-created.listener';
import { UsersModule } from 'src/users/users.module';
import { SupportTicketListener } from './support-ticket.listener';
import { SystemListenerHelper } from './system-listeners.helper';

@Module({
  imports: [MailModule, UsersModule],
  providers: [
    SystemListenerHelper,
    UserListener,
    LeadCreatedListener,
    SupportTicketListener,
  ],
})
export class ListenersModule {}
