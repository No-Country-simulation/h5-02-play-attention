import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resource } from './schemas/resource.schema';
import { UploadService } from '../cloudinary/upload.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { Categories } from '../categories/schema/categories.model';
import { UpdateResourceDto } from './dto/update-resource.dto';

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
      if(createResourceDto.category){
        const category = await this.categoriesModel.findById(createResourceDto.category);
        if (!category) {
          throw new BadRequestException('La categoría no existe');
        }
      }
      
      const newResource = new this.resourceModel({
        title: createResourceDto.title,
        description: createResourceDto.description,
        type: createResourceDto.type,
        published: createResourceDto.published,
        url: url,
        category: createResourceDto.category
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
  async update(id: string, updateResourceDto: UpdateResourceDto, file?: Express.Multer.File): Promise<Resource> {
    const resource = await this.resourceModel.findById(id);
    if (!resource) {
      throw new BadRequestException(`Recurso con ID ${id} no encontrado`);
    }

    try {
      let url: string | undefined;
      
      if ((file || updateResourceDto.url) && resource.url && resource.url.includes('cloudinary')) {
        await this.uploadService.deleteFile(resource.url);
      }

      if (file) {
        const uploadResult = await this.uploadService.uploadFile(file);
        url = uploadResult.secure_url;
      } else if (updateResourceDto.url) {
        try {
          new URL(updateResourceDto.url);
          url = updateResourceDto.url;
        } catch (error) {
          throw new BadRequestException('La URL proporcionada no es válida');
        }
      }

      const updateData = {
        ...updateResourceDto,
        ...(url && { url })
      };

      const updatedResource = await this.resourceModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).populate('category');

      if (!updatedResource) {
        throw new BadRequestException('Error al actualizar el recurso');
      }

      return updatedResource;
    } catch (error) {
      throw new BadRequestException('Error al actualizar el recurso: ' + error.message);
    }
  }

  async findAllPublished(published: boolean): Promise<Resource[]> {
    return this.resourceModel.find({ published }).sort({ createdAt: -1 }).populate('category').exec();
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourceModel.findById(id).populate('category').exec();
    if (!resource) {
      throw new BadRequestException(`Recurso con ID ${id} no encontrado`);
    }
    return resource;
  }

  async remove(id: string): Promise<Resource> {
    const resource = await this.resourceModel.findById(id);
    if (!resource) {
      throw new BadRequestException(`Recurso con ID ${id} no encontrado`);
    }

    if (resource.url && resource.url.includes('cloudinary')) {
      await this.uploadService.deleteFile(resource.url);
    }

    await this.resourceModel.deleteOne({ _id: id });
    return resource;
  }

  async findAll() {
    return this.resourceModel.find().exec();
  }
}
