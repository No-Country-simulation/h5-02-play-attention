import {
  TicketCategory,
  TicketOrigin,
  TicketPriority,
  TicketStatuses,
} from '../support-ticket.constants';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';
import { UserMinimalDto } from 'src/users/dto/return-user.dto';

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

  @ApiProperty({ type: UserMinimalDto })
  @Expose({ name: 'user_id' })
  @Type(() => UserMinimalDto)
  user_id: UserMinimalDto;

  @ApiProperty({ type: UserMinimalDto })
  @Expose({ name: 'assigned_to' })
  @Type(() => UserMinimalDto)
  assigned_to: UserMinimalDto;

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
