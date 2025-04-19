import { IsNumberString, IsOptional } from 'class-validator';

export class QueryUsersDto {
  @IsOptional()
  @IsNumberString({}, { message: 'La página debe ser un número' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El límite debe ser un número' })
  limit?: string;
}
