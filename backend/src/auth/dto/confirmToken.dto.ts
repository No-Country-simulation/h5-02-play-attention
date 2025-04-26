import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ConfirmTokenDto{
    @ApiProperty({example: '123456', description: 'Token de confirmación'})
    @IsNotEmpty({message:"Es necesario ingresar el token"})
    token:string
}