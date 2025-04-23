import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ResourceType } from '../schemas/resource.schema';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de recurso es requerido' })
  type: ResourceType;

  @IsBoolean()
  @Type(()=>Boolean)
  @IsNotEmpty({ message: 'Debes seleccionar si el recurso está publicado' })
  published: boolean;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es requerida' })
  category: Types.ObjectId;

}
