import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UserMinimalDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  fullname: string;
}
