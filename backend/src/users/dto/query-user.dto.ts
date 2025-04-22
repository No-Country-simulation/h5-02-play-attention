import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryUsersDto {
  @ApiProperty({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @IsOptional()
  @IsNumberString({}, { message: 'La página debe ser un número' })
  page?: string;

  @ApiProperty({ name: 'limit', required: false, type: Number, description: 'Límite de resultados por página' })
  @IsOptional()
  @IsNumberString({}, { message: 'El límite debe ser un número' })
  limit?: string;
}
