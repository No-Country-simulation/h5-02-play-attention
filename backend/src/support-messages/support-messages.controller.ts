import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { SupportMessagesService } from './support-messages.service';
import { CreateSupportMessagesDto, UpdateSupportMessageDto } from './dto/support-messages.dto';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { SupportMessages } from './schema/support-messages.model';

@ApiTags('support-messages')
@Controller('/api/support-messages')
export class SupportMessagesController {

    constructor(private readonly supportMessagesService: SupportMessagesService) {}

    @Post()
    @ApiOperation({summary: 'Crear nuevo mensaje de soporte'})
    @ApiBody({
        type: CreateSupportMessagesDto
    })
    @ApiResponse({
        status: 201,
        description: 'Mensaje creado exitosamente',
        type: SupportMessages
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    createMessage(@Body() body: CreateSupportMessagesDto) {
        return this.supportMessagesService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los mensajes'})
    @ApiResponse({
        status: 200,
        description: 'Lista de mensajes obtenida'
    })
    findAllMessages() {
        return this.supportMessagesService.getAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener mensaje por ID de Ticket'})
    @ApiParam({
        name: 'id',
        description: 'ID del mensaje a buscar',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Mensaje encontrado',
        type: SupportMessages
    })
    @ApiResponse({
        status: 400,
        description: 'No se halló el mensaje'
    })
    findById(@Param('id') id: string) {
        return this.supportMessagesService.getByTicketId(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar mensaje'})
    @ApiBody({
        type: UpdateSupportMessageDto
    })
    @ApiParam({
        name: 'id',
        description: 'ID del mensaje a editar',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Mensaje actualizado correctamente',
        type: SupportMessages
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    editMessage(@Param('id') id: string, @Body() body: UpdateSupportMessageDto) {
        return this.supportMessagesService.editMessage(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminación de un mensaje'})
    @ApiParam({
        name: 'id',
        description: 'ID del mensaje a eliminar',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Mensaje eliminado correctamente'
    })
    @ApiResponse({
        status: 400,
        description: 'No se pudo eliminar el mensaje'
    })
    removeMessage(@Param('id') id: string) {
        return this.supportMessagesService.removeMessage(id);
    }
}
