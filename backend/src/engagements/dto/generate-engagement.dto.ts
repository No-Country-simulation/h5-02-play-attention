import {
  IsString,
  IsOptional,
  IsDate,
  MinLength,
  MaxLength,
  IsIn,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LEAD_CONTACT_TYPES } from '../engagements.constants';

export class GenerateEngagementDto {
  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsString()
  @IsMongoId()
  lead_id: string;

  @ApiProperty({
    required: true,
    enum: LEAD_CONTACT_TYPES,
  })
  @IsIn(LEAD_CONTACT_TYPES)
  contact_type: (typeof LEAD_CONTACT_TYPES)[number];

  @ApiProperty({
    required: true,
    type: 'string',
    example: '1/1/2025',
  })
  @IsDate()
  @Type(() => Date)
  contact_date: Date;

  @ApiProperty({
    required: false,
    type: 'string',
    maxLength: 256,
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(256)
  subject?: string;

  @ApiProperty({
    required: true,
    type: 'string',
    maxLength: 256,
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  detail: string;

  @ApiProperty({
    required: false,
    type: 'string',
    maxLength: 256,
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(512)
  response?: string;
  @IsOptional()
  @IsString()
  created_by?: string = 'system';
}
