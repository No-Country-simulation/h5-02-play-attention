import { IsString, IsEmail, IsNotEmpty, IsOptional, IsMongoId, IsIn, MaxLength, MinLength, IsBoolean } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { LEAD_ORIGINS, LEAD_SERVICE_OPTIONS, LEAD_STATUS } from "../leads.constants";

export class CreateLeadDto {

    @ApiProperty({ example: 'Juan Pimienta', description: 'Nombre del usuario'})
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({ example: 'Microsoft', description: 'Compañía a la que el usuario representa'})
    @IsString()
    @IsOptional()
    company?: string;

    @ApiProperty({ example: '+34 53281985739', description: 'Número de teléfono del usuario'})
    @IsString()
    @IsOptional()
    phone: string;

    @ApiProperty({ example: 'juan@mail.com', description: 'correo electrónico del usuario'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Profesional', description: 'Servicio que el usuario busca recibir', enum: LEAD_SERVICE_OPTIONS})
    @IsString()
    @IsNotEmpty()
    @IsIn(LEAD_SERVICE_OPTIONS)
    service: string;

    @ApiProperty({ example: 'El usuario desea el producto...', description: 'Notas escritas admin en el CRM'})
    @IsString()
    @IsOptional()
    notes?: string;
    
    @ApiProperty({ example: 'Nuevo', description: 'Estado del lead', enum: LEAD_STATUS})
    @IsString()
    @IsNotEmpty()
    @IsIn(LEAD_STATUS)
    status: string;

    @ApiProperty({ example: 'Redes sociales', description: 'Origen del contacto del usuario', enum: LEAD_ORIGINS})
    @IsString()
    @IsNotEmpty()
    @IsIn(LEAD_ORIGINS)
    origen: string;

    @ApiProperty({ example: 'Director', description: 'Relación del usuario con el servicio solicitado'})
    @IsString()
    @IsNotEmpty()
    relation: string;

    @ApiProperty({example: true, description: 'Campo para que el usuario se suscriba a la newsletter'})
    @IsBoolean()
    newsletter: boolean;

}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}

export class CreateLeadFromLandingDto {
    @ApiProperty({
        description: 'Mensaje del formulario de contacto',
        example: 'Hola, necesito ayuda con...',
    })
    @IsString()
    @MaxLength(1024)
    @MinLength(5)
    message: string;

    @ApiProperty({ example: 'Juan Pimienta', description: 'Nombre del usuario'})
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({ example: 'Microsoft', description: 'Compañía a la que el usuario representa'})
    @IsString()
    @IsOptional()
    company?: string;

    @ApiProperty({ example: '+34 53281985739', description: 'Número de teléfono del usuario'})
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'juan@mail.com', description: 'correo electrónico del usuario'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Profesional', description: 'Servicio que el usuario busca recibir', enum: LEAD_SERVICE_OPTIONS})
    @IsString()
    @IsNotEmpty()
    @IsIn(LEAD_SERVICE_OPTIONS)
    service: string;

    @ApiProperty({ example: 'Director', description: 'Relación del usuario con el servicio solicitado'})
    @IsString()
    @IsNotEmpty()
    relation: string;

    @ApiProperty({example: true, description: 'Campo para que el usuario se suscriba a la newsletter'})
    @IsBoolean()
    newsletter: boolean;
}