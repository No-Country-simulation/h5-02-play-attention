import { forwardRef, Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Leads, LeadsSchema } from './schema/leads.model';
import { EngagementsModule } from 'src/engagements/engagements.module';
import { MailModule } from 'src/mail/mail.module';
import { LeadCreatedListener } from 'src/system-listeners/lead-created.listener';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => EngagementsModule),
    MongooseModule.forFeature([
      {
        name: Leads.name,
        schema: LeadsSchema,
      },
    ]),
    MailModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService, LeadCreatedListener],
  exports: [LeadsService],
})
export class LeadsModule {}
