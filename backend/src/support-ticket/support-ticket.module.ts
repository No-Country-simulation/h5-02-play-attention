import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportTicketController } from './support-ticket.controller';
import { UsersModule } from 'src/users/users.module';
import {
  SupportTickets,
  SupportTicketSchema,
} from './schema/support-ticket.schema';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketRepository } from './support-ticket.repository';
import { TokenModule } from 'src/token/token.module';

@Module({
  controllers: [SupportTicketController],
  imports: [
    UsersModule,
    TokenModule,
    MongooseModule.forFeature([
      {
        name: SupportTickets.name,
        schema: SupportTicketSchema,
      },
    ]),
  ],
  providers: [SupportTicketService, SupportTicketRepository],
})
export class SupportTicketModule {}
