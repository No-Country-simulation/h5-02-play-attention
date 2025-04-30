import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import {
  TICKET_CATEGORY,
  TICKET_ORIGIN,
  TICKET_PRIORITY,
  TICKET_STATUSES,
  TicketCategory,
  TicketOrigin,
  TicketPriority,
  TicketStatuses,
} from '../support-ticket.constants';
import { ResponseSupportTicketDto } from '../dto/response-ticket.dto';

export type SupportTicketsDocument = HydratedDocument<SupportTickets>;

@Schema({ timestamps: true })
export class SupportTickets {
  readonly _id?: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  description: string;
  @Prop({
    type: String,
    required: true,
    default: 'open',
    enum: TICKET_STATUSES,
  })
  status: TicketStatuses;
  @Prop({
    type: String,
    required: true,
    enum: TICKET_CATEGORY,
    default: 'bug',
  })
  category: TicketCategory;
  @Prop({
    type: String,
    required: true,
    enum: TICKET_PRIORITY,
    default: 'medium',
  })
  priority: TicketPriority;
  @Prop({
    type: String,
    required: true,
    enum: TICKET_ORIGIN,
  })
  ticket_origin: TicketOrigin;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  })
  user_id?: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  })
  assigned_to?: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  created_by: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  })
  updated_by?: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(
  SupportTickets,
).set('toJSON', {
  transform: (_, ret) => {
    return plainToInstance(ResponseSupportTicketDto, ret, {
      excludeExtraneousValues: true,
    });
  },
});
