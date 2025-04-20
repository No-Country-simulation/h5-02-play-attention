import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateLeadDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsString()
    company: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    service: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    status: string;

}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}