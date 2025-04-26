import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";


export class ForgotPasswordDto{
    @ApiProperty({description:"Correo electrónico del usuario"})
    @IsEmail()
    email:string;
}
