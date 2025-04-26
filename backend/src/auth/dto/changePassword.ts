import {ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: '123456', description: 'Contraseña' })
  @MinLength(6, { message: "La contraseña debe tener al menos 8 caracteres" })
  @MaxLength(10, { message: "La contraseña debe tener como máximo 20 caracteres" })
  password: string;
}

export class TokenDto {
  @ApiProperty({ example: '123456', description: 'Token' })
  @IsNotEmpty({ message: "Es necesario ingresar el token" })
  @IsString({ message: "El token debe ser una cadena de texto" })
  token: string;
}
