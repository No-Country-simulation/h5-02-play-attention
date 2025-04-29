import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  TICKET_CATEGORY,
  TICKET_ORIGIN,
  TICKET_PRIORITY,
  TicketCategory,
  TicketOrigin,
  TicketPriority,
} from '../support-ticket.constants';

export class GenerateSupportTicketDto {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
  user_id: string;
  assigned_to?: string;
  created_by: string;
  ticket_origin: TicketOrigin;
}

export class UserGenerateSupportTicketDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MaxLength(128)
  @MinLength(2)
  title: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @MaxLength(512)
  @MinLength(2)
  description: string;

  @ApiProperty({
    required: true,
    enum: TICKET_CATEGORY,
    default: 'bug',
  })
  @IsIn(TICKET_CATEGORY)
  category: TicketCategory;
}

export class AdminGenerateSupportTicketDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MaxLength(128)
  @MinLength(2)
  title: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @MaxLength(512)
  @MinLength(2)
  description: string;

  @ApiProperty({
    required: true,
    enum: TICKET_CATEGORY,
    default: 'bug',
  })
  @IsIn(TICKET_CATEGORY)
  category: TicketCategory;

  @ApiProperty({
    required: false,
    enum: TICKET_PRIORITY,
    default: 'medium',
  })
  @IsOptional()
  @IsIn(TICKET_PRIORITY)
  priority?: TicketPriority;

  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  user_id: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  assigned_to?: string;

  @ApiProperty({
    type: String,
    required: true,
    enum: TICKET_ORIGIN,
  })
  @IsIn(TICKET_ORIGIN)
  ticket_origin: TicketOrigin;
}
