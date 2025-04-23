import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationResponseDto<T> {
  @ApiProperty()
  data: T[];
  @ApiProperty()
  current_page: number;
  @ApiProperty()
  next_page: number;
  @ApiProperty()
  prev_page: number;
  @ApiProperty()
  last_page: number;
  @ApiProperty()
  total_records: number;
  @ApiProperty()
  page_records: number;
  @ApiProperty()
  urls?: {
    next: string;
    prev: string;
    last: string;
    first: string;
  };
}

export class QueryPaginationDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  page?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Límite de resultados por página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  take?: number;
}
