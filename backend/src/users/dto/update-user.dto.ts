import { IsString, IsEmail, IsOptional, MinLength, IsNotEmpty, IsBoolean } from 'class-validator';
import { Services, UserRole } from '../schema/user.schema';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  name?: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Debes elegir el tipo de servicio' })
  service?: Services;

  @IsOptional()
  @IsNotEmpty({ message: 'Debes elegir el rol del usuario' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({message: 'El estado debe ser un booleano'})
  isActive?: boolean;
}


