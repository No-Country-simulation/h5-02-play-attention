import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { GenerateEngagementDto } from './generate-engagement.dto';

export class UpdateEngagementDto extends PartialType(
  OmitType(GenerateEngagementDto, ['lead_id'] as const),
) {}

export class ResponseEngagementDto extends PickType(GenerateEngagementDto, [
  'response',
]) {
  @ApiProperty({
    required: true,
    type: 'string',
    maxLength: 256,
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(512)
  response: string;
}
