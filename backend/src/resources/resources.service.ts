import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from './schemas/resource.schema';
import { UploadService } from '../cloudinary/upload.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<Resource>,
    private readonly uploadService: UploadService,
  ) {}

  async create(file: Express.Multer.File, createResourceDto: CreateResourceDto): Promise<Resource> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    try {
      const uploadResult = await this.uploadService.uploadFile(file);
      
      const resource = new this.resourceModel({
        title: createResourceDto.title,
        description: createResourceDto.description,
        url: uploadResult.secure_url,
      });

      return resource.save();
    } catch (error) {
      throw new BadRequestException('Error al subir el archivo: ' + error.message);
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
