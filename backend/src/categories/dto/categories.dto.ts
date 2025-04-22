import { IsString, IsNotEmpty, IsMongoId, IsOptional, IsArray } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {

    @ApiProperty({ example: 'Material', description: 'Nombre de la categoría'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Material para los recursos', description: 'Descripción de la categoría'})
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: ['680806758b72e7d150ea8964', '680806b8e322d231e2539293'], description: 'ID de resourses a guardar'})
    @IsOptional()
    @IsArray()
    @IsMongoId({each: true})
    resources_id: string[]; 
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}