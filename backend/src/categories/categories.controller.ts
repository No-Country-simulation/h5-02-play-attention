import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Categories } from './schema/categories.model';
import { deepEqual } from 'assert';

@ApiTags('categories')
@Controller('/api/categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @ApiOperation({ summary: 'Crear categoría' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({
        status: 201,
        description: 'Categoría creada exitosamente',
        type: Categories
    })
    @ApiResponse({
        status: 400,
        description: 'Datos invalidos'
    })
    createCategory(@Body() createCategoryDto: CreateCategoryDto){
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorias'})
    @ApiResponse({
        status: 200,
        description: 'Lista de categorias',
        type: [Categories]
    })
    @ApiResponse({
        status: 400,
        description: 'No se encontraron categorias'
    })
    listCategories() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener categoría por ID'})
    @ApiParam({
        name: 'id',
        description: 'ID de la categoría a obtener',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Categoría encontrada',
        type: Categories
    })
    @ApiResponse({
        status: 400,
        description: 'No se encontró la categoría'
    })
    findById(@Param('id') id: string) {
        return this.categoriesService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una categoría'})
    @ApiParam({
        name: 'id',
        description: 'ID de la categoría a actualizar',
        type: String
    })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'Categoría actualizada correctamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una categoría' })
    @ApiParam({
        name: 'id',
        description: 'ID de la categoría a eliminar',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Categoría eliminada correctamente'
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    remove(@Param('id') id: string) {
        return this.categoriesService.deleteCategory(id);
    }
}
