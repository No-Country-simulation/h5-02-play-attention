import { Controller, Get, Post, Param, Delete, UploadedFile, UseInterceptors, ParseUUIDPipe, Body, NotFoundException, Put, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/isMongoIdValidation.pipe';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateResourceDto } from './dto/update-resource.dto';


@ApiTags("resources")
@Controller('api/resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un recurso' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary'},
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string' },
        published: { type: 'boolean' },
        category: { type: 'string' },
        url: { type: 'string', },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Recurso creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    const resource = await this.resourcesService.create(file, createResourceDto);
    return {
      message: 'Recurso creado correctamente',
      resource
    };
  }

  @Put(":id")
  @ApiOperation({ summary: 'Actualizar un recurso por ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary'},
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string' },
        published: { type: 'boolean' },
        category: { type: 'string' },
        url: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Recurso actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateResourceDto: UpdateResourceDto
  ) {
    const resource = await this.resourcesService.update(id, updateResourceDto, file);
    return {
      message: 'Recurso actualizado correctamente',
      resource
    };
  }
  
  @Get()
  @ApiOperation({ summary: 'Obtener todos los recursos' })
  @ApiResponse({ status: 200, description: 'Recursos obtenidos correctamente' })
  @ApiResponse({ status: 404, description: 'Recursos no encontrados' })
  @ApiQuery({ name: 'published', type: 'boolean', required: false })
  async findAll(
    @Query('published') published: boolean=true
  ) {
    const resources = await this.resourcesService.findAll(published);
    if(!resources) {
      throw new NotFoundException('No se encontraron recursos');
    }
    return {
      resources
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un recurso por ID' })
  @ApiResponse({ status: 200, description: 'Recurso obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  async findOne(@Param('id', MongoIdValidationPipe) id: string) {
    const resource = await this.resourcesService.findOne(id);
    return {
      resource
    };
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un recurso por ID' })
  @ApiResponse({ status: 200, description: 'Recurso eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  async remove(@Param('id', MongoIdValidationPipe) id: string) {
     await this.resourcesService.remove(id);
    return {
      message: 'Recurso eliminado correctamente'
    };
  }
}
