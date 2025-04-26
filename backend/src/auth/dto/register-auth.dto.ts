import { IsEmail, IsEnum, IsIn, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole, Services, UserRoleType } from '../../users/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  fullname: string;

  @ApiProperty({ example: 'juan@mail.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @MinLength(6, { message: 'El Password debe contener 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'Profesional', description: 'Tipo de servicio del usuario', enum: Object.values(Services) })
  @IsNotEmpty({ message: 'Debes elegir el tipo de servicio' })
  @IsEnum(Object.values(Services))
  service: Services;

  @ApiProperty({example:"Profesional",description:"Rol del usuario", enum: Object.values(UserRole)},)
  @IsNotEmpty({ message: 'Debes elegir el rol del usuario' })
  @IsIn(Object.values(UserRole))
  role: UserRole;
}
