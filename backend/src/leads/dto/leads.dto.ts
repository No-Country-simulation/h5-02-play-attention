import { IsString, IsEmail, IsNotEmpty, IsOptional, IsMongoId } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";

export class CreateLeadDto {

    @ApiProperty({ example: 'Juan Pimienta', description: 'Nombre del usuario'})
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({ example: ['6807a07d7266c791b8851e8b', '6807a096c4c418358cea4c14'], description: 'IDs de contactos'})
    @IsMongoId()
    @IsOptional()
    contact_id: string[];

    @ApiProperty({ example: 'Microsoft', description: 'Compañía a la que el usuario representa'})
    @IsString()
    @IsOptional()
    company: string;

    @ApiProperty({ example: '+34 53281985739', description: 'Número de teléfono del usuario'})
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'juan@mail.com', description: 'correo electrónico del usuario'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Profesional', description: 'Servicio que el usuario busca recibir'})
    @IsString()
    @IsNotEmpty()
    service: string;

    @ApiProperty({ example: 'Buen día, me comunico por...', description: 'Mensaje enviado por el usuario'})
    @IsString()
    @IsOptional()
    message: string;
    
    @ApiProperty({ example: 'Nuevo', description: 'Estado del lead'})
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiProperty({ example: 'Redes sociales', description: 'Origen del contacto del usuario'})
    @IsString()
    @IsNotEmpty()
    origen: string;

    @ApiProperty({ example: 'Director', description: 'Relación del usuario con el servicio solicitado'})
    @IsString()
    @IsNotEmpty()
    relation: string;

}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}