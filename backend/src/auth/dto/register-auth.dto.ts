import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole, Services } from '../../users/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'juan@mail.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @MinLength(6, { message: 'El Password debe contener 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'Profesional', description: 'Tipo de servicio del usuario' })
  @IsNotEmpty({ message: 'Debes elegir el tipo de servicio' })
  service: Services;

  @ApiProperty({example:"Profesional",description:"Rol del usuario"})
  @IsNotEmpty({ message: 'Debes elegir el rol del usuario' })
  role: UserRole;
}
