import {
  TicketCategory,
  TicketOrigin,
  TicketPriority,
  TicketStatuses,
} from '../support-ticket.constants';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';

export class ResponseSupportTicketDto {
  @ApiProperty()
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: TicketStatuses;

  @ApiProperty()
  @Expose()
  category: TicketCategory;

  @ApiProperty()
  @Expose()
  priority: TicketPriority;

  @ApiProperty()
  @Expose()
  ticket_origin: TicketOrigin;

  @ApiProperty({ required: false })
  @Expose({ name: 'user_id' })
  @Transform(({ obj }) => (obj.user_id ? obj.user_id.toString() : undefined))
  user_id?: string;

  @ApiProperty()
  @Expose({ name: 'assigned_to' })
  @Transform(({ obj }) =>
    obj.assigned_to ? obj.assigned_to.toString() : undefined,
  )
  assigned_to: string;

  @ApiProperty()
  @Expose({ name: 'created_by' })
  @Transform(({ obj }) => obj.created_by.toString())
  created_by: string;

  @ApiProperty({ required: false })
  @Expose({ name: 'updated_by' })
  @Transform(({ obj }) =>
    obj.updated_by ? obj.updated_by.toString() : undefined,
  )
  updated_by?: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) =>
    obj.createdAt ? obj.createdAt.toISOString() : new Date(),
  )
  created_at: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) =>
    obj.createdAt ? obj.createdAt.toISOString() : new Date(),
  )
  updated_at: Date;

  @Exclude()
  __v: number;
}

export class SupportTicketPaginationDto extends PaginationResponseDto<ResponseSupportTicketDto> {
  @ApiProperty({ type: ResponseSupportTicketDto, isArray: true })
  data: ResponseSupportTicketDto[];
}
