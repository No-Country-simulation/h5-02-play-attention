import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resource } from './schemas/resource.schema';
import { UploadService } from '../cloudinary/upload.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { Categories } from '../categories/schema/categories.model';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel('Resource') private resourceModel: Model<Resource>,
    @InjectModel('Categories') private categoriesModel: Model<Categories>,
    private uploadService: UploadService
  ) {}

  async create(file: Express.Multer.File, createResourceDto: CreateResourceDto): Promise<Resource> {
    if (!file && !createResourceDto.url) {
      throw new BadRequestException('Se debe proporcionar un archivo o una URL');
    }

    try {
      let url: string;
      
      if (file) {
        const uploadResult = await this.uploadService.uploadFile(file);
        url = uploadResult.secure_url;
      } else if (createResourceDto.url) {
       
        try {
          new URL(createResourceDto.url);
          url = createResourceDto.url;
        } catch (error) {
          throw new BadRequestException('La URL proporcionada no es válida');
        }
      }
      
      const newResource = new this.resourceModel({
        title: createResourceDto.title,
        description: createResourceDto.description,
        type: createResourceDto.type,
        published: createResourceDto.published,
        url: url,
      });

      const category = await this.categoriesModel.findById(createResourceDto.category);
      if (!category) {
        throw new BadRequestException('La categoría no existe');
      }

      category.resources_id.push(newResource._id as Types.ObjectId);
      const [, resource] = await Promise.all([category.save(), newResource.save()]);

      return resource;
    } catch (error) {
      throw new BadRequestException('Error al crear el recurso: ' + error.message);
    }
  }

  async findAll(): Promise<Resource[]> {
    return this.resourceModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourceModel.findById(id).exec();
    if (!resource) {
      throw new BadRequestException(`Recurso con ID ${id} no encontrado`);
    }
    return resource;
  }

  async remove(id: string): Promise<Resource> {
    const resource = await this.resourceModel.findByIdAndDelete(id).exec();
    if (!resource) {
      throw new BadRequestException(`Recurso con ID ${id} no encontrado`);
    }
    return resource;
  }
}
