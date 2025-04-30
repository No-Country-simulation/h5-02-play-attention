import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsOptional } from 'class-validator';
import {
  TICKET_CATEGORY,
  TICKET_PRIORITY,
  TICKET_STATUSES,
  TicketCategory,
  TicketOrigin,
  TicketPriority,
  TicketStatuses,
} from '../support-ticket.constants';

export class UpdateSupportTicketDto {
  @ApiProperty({
    required: false,
    enum: TICKET_CATEGORY,
    default: 'bug',
  })
  @IsOptional()
  @IsIn(TICKET_CATEGORY)
  category?: TicketCategory;

  @ApiProperty({
    required: false,
    enum: TICKET_PRIORITY,
    default: 'medium',
  })
  @IsOptional()
  @IsIn(TICKET_PRIORITY)
  priority?: TicketPriority;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  user_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  assigned_to?: string;

  @ApiProperty({
    required: false,
    enum: TICKET_STATUSES,
  })
  @IsOptional()
  @IsIn(TICKET_STATUSES)
  status?: TicketStatuses;
}

export class UpdateSupportTicketsIntDto {
  status?: TicketStatuses;
  category?: TicketCategory;
  priority?: TicketPriority;
  ticket_origin?: TicketOrigin;
  user_id?: string;
  assigned_to?: string;
  created_by: string;
  updated_by?: string;
}
