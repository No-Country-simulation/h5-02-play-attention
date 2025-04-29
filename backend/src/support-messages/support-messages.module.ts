import { forwardRef, Module } from '@nestjs/common';
import { SupportMessagesService } from './support-messages.service';
import { SupportMessagesController } from './support-messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportMessages, SupportMessagesSchema } from './schema/support-messages.model';
import { SupportTicketModule } from 'src/support-ticket/support-ticket.module';
import { SupportTicketService } from 'src/support-ticket/support-ticket.service';
import { SupportTicketRepository } from 'src/support-ticket/support-ticket.repository';
import { UsersService } from 'src/users/users.service';
import { SupportTickets, SupportTicketSchema } from 'src/support-ticket/schema/support-ticket.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    forwardRef(() => SupportTicketModule),
    MongooseModule.forFeature([
      {
        name: SupportMessages.name,
        schema: SupportMessagesSchema,
      }
    ]),
    SupportTicketModule,
    MongooseModule.forFeature([
      {
        name: SupportTickets.name,
        schema: SupportTicketSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  providers: [SupportMessagesService, SupportTicketService, SupportTicketRepository, UsersService],
  controllers: [SupportMessagesController]
})
export class SupportMessagesModule {}
