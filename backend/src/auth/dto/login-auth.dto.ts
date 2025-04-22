import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'juan@mail.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;
  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsNotEmpty({ message: 'El password es obligatorio' })
  password: string;
}
