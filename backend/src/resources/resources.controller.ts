import { Controller, Get, Post, Param, Delete, UploadedFile, UseInterceptors, ParseUUIDPipe, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/isMongoIdValidation.pipe';

@Controller('api/resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    const resource = await this.resourcesService.create(file, createResourceDto);
    return {
      message: 'Archivo subido correctamente',
      resource
    };
  }

  @Get()
  async findAll() {
    const resources = await this.resourcesService.findAll();
    return {
      resources
    };
  }

  @Get(':id')
  async findOne(@Param('id', MongoIdValidationPipe) id: string) {
    const resource = await this.resourcesService.findOne(id);
    return {
      resource
    };
  }

  @Delete(':id')
  async remove(@Param('id', MongoIdValidationPipe) id: string) {
     await this.resourcesService.remove(id);
    return {
      message: 'Recurso eliminado correctamente'
    };
  }
}
