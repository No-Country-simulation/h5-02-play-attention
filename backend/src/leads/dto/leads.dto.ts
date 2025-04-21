import { IsString, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateLeadDto {

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsOptional()
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
    @IsOptional()
    message: string;

    @IsString()
    @IsNotEmpty()
    status: string;

}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}