import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { ResourceType } from '../schemas/resource.schema';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ name: 'title', required: true, type: String, description: 'Título del recurso', example: 'Título del recurso' })
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @ApiProperty({ name: 'description', required: true, type: String, description: 'Descripción del recurso', example: 'Descripción del recurso' })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @ApiProperty({ 
    name: 'type', 
    required: true, 
    enum: ResourceType,
    description: 'Tipo de recurso', 
    example: ResourceType.VIDEO 
  })
  @IsEnum(ResourceType, { message: 'El tipo de recurso debe ser uno de los siguientes: video, image, pdf' })
  @IsNotEmpty({ message: 'El tipo de recurso es requerido' })
  type: ResourceType;

  @ApiProperty({ name: 'published', required: true, type: Boolean, description: 'Si el recurso está publicado', example: true })
  @IsBoolean()
  @Type(()=>Boolean)
  @IsNotEmpty({ message: 'Debes seleccionar si el recurso está publicado' })
  published: boolean;

  @ApiProperty({ name: 'category', required: true, type: Types.ObjectId, description: 'Categoría del recurso', example:"667464646464646464646464" })
  @IsMongoId({ message: 'El ID de la categoría no es válido' })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  category: Types.ObjectId;

  @ApiProperty({ name: 'url', required: false, type: String, description: 'URL del recurso (opcional)', example: 'https://youtube.com/watch?v=...' })
  @IsString()
  @IsOptional()
  url?: string;

}
