import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole, Services } from '../../users/schema/user.schema';

export class RegisterDto {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @MinLength(6, { message: 'El Password debe contener 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'Debes elegir el tipo de servicio' })
  service: Services;

  @IsNotEmpty({ message: 'Debes elegir el rol del usuario' })
  role: UserRole;
}
