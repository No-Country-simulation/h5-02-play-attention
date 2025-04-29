import { QueryPaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import {
  TICKET_CATEGORY,
  TICKET_PRIORITY,
  TICKET_SORTABLE_FIELDS,
  TICKET_STATUSES,
} from '../support-ticket.constants';

export class GetTicketsFilterDto extends QueryPaginationDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(999)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(999)
  take?: number;

  @ApiPropertyOptional({
    description: 'Ticket category',
    enum: TICKET_CATEGORY,
  })
  @IsOptional()
  @IsIn(TICKET_CATEGORY)
  category?: string;

  @ApiPropertyOptional({
    description: 'Ticket priority',
    enum: TICKET_PRIORITY,
  })
  @IsOptional()
  @IsIn(TICKET_PRIORITY)
  priority?: string;

  @ApiPropertyOptional({ description: 'Ticket status', enum: TICKET_STATUSES })
  @IsOptional()
  @IsIn(TICKET_STATUSES)
  status?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'created_at',
    enum: TICKET_SORTABLE_FIELDS,
  })
  @IsOptional()
  @IsString()
  @IsIn(TICKET_SORTABLE_FIELDS)
  sort_by?: (typeof TICKET_SORTABLE_FIELDS)[number];

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
