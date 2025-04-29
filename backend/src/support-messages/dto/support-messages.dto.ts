import { IsString, IsMongoId, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { isNullOrUndefined } from "util";

export class CreateSupportMessagesDto {
    
    @ApiProperty({ example: '680cef0798cc4181c32d3533', description: 'ID del usuario o admin registrado que envía el mensaje' })
    @IsNotEmpty()
    @IsMongoId()
    user_id: string;
    
    @ApiProperty({ example: 'No me funciona esta feature', description: 'Envío del texto del mensaje por parte del usuario o admin'})
    @IsNotEmpty()
    @IsString()
    text: string;

    @ApiProperty({ example: '681130f6b153e35125bf1f0a', description: 'ID del ticket al que mensaje se asocia' })
    @IsNotEmpty()
    @IsMongoId()
    ticket_id: string;
}

export class UpdateSupportMessageDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text: string;
}