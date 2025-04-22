import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/leads.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Leads } from './schema/leads.model';

@ApiTags('leads')
@Controller('/api/leads')
export class LeadsController {

    constructor(private readonly leadsService: LeadsService) {}

    @Post()
    @ApiOperation({summary: 'Crear nuevo lead'})
    @ApiBody({ type: CreateLeadDto})
    @ApiResponse({
        status: 201,
        description: 'Lead creado exitosamente',
        type: Leads
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    create(@Body() createLeadDto: CreateLeadDto) {
        return this.leadsService.createLead(createLeadDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los leads'})
    @ApiResponse({
        status: 200,
        description: 'Lista de leads',
        type: [Leads]
    })
    findAll() {
        return this.leadsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener lead por ID'})
    @ApiParam({
        name: 'id',
        description: 'ID del lead a obtener',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Lead encontrado',
        type: Leads
    })
    @ApiResponse({
        status: 400,
        description: 'No se halló el lead'
    })
    findById(@Param('id') id: string) {
        return this.leadsService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un ejercicio'})
    @ApiParam({
        name: 'id',
        description: 'ID del lead a actualizar',
        type: String
    })
    @ApiBody({ type: UpdateLeadDto})
    @ApiResponse({
        status: 200,
        description: 'Lead actualizado correctamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
        return this.leadsService.updateLead(id, updateLeadDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Eliminar un lead'})
    @ApiParam({
        name: 'id',
        description: 'ID del lead a eliminar',
        type: String
    })
    erase(@Param('id') id: string) {
        return this.leadsService.deleteLead(id);
    }

}
