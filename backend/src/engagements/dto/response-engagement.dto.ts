import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Leads } from '../../leads/schema/leads.model';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';

export class EngagementResponseDto {
  @ApiProperty()
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @ApiProperty()
  @Expose({ name: 'lead_id' })
  @Transform(({ obj }) => obj.lead.toString())
  lead_id: string;

  @ApiProperty()
  @Expose()
  contact_type: string;

  @ApiProperty()
  @Expose()
  contact_date: Date;

  @ApiProperty()
  @Expose()
  subject: string;

  @ApiProperty()
  @Expose()
  detail: string;

  @ApiProperty()
  @Expose()
  response?: string;

  @ApiProperty()
  @Expose()
  updated_by?: string;

  @ApiProperty()
  @Expose()
  created_by: string;

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
  lead: Leads;

  @Exclude()
  __v: number;
}

export class EngagementPaginationDto extends PaginationResponseDto<EngagementResponseDto> {
  @ApiProperty({ type: EngagementResponseDto, isArray: true })
  data: EngagementResponseDto[];
}
