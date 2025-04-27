import { IsString, IsMongoId, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSupportMessagesDto {
    
    @ApiProperty({ example: '680cef0798cc4181c32d3533', description: 'ID del usuario o admin registrado que envía el mensaje' })
    @IsNotEmpty()
    @IsMongoId()
    user_id: string;
    
    @ApiProperty({ example: 'No me funciona esta feature', description: 'Envío del texto del mensaje por parte del usuario o admin'})
    @IsNotEmpty()
    @IsString()
    text: string;
}

export class UpdateSupportMessageDto extends PartialType(CreateSupportMessagesDto) {}