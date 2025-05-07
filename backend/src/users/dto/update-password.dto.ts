import { IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/common/validators/match.validator';
import { NotEqualTo } from 'src/common/validators/not-equal.validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ type: String })
  @IsString()
  currentPassword: string;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(6)
  @NotEqualTo('currentPassword')
  newPassword: string;

  @ApiProperty({ type: String })
  @IsString()
  @ValidateIf((o) => o.newPassword)
  @Match('newPassword')
  confirmPassword: string;
}
