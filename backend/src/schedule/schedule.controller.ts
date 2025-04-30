import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { MongoIdValidationPipe } from '../common/pipes/isMongoIdValidation.pipe';
import {  UserDocument } from '../users/schema/user.schema';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: UserDocument;
}

@ApiTags('schedule')
@Controller('api/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un horario' })
  @ApiResponse({ status: 201, description: 'Horario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Req() req: RequestWithUser
  ) {
    const schedule = await this.scheduleService.create(createScheduleDto, req.user);
    return {
      message: 'Horario creado correctamente',
      schedule
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios' })
  @ApiResponse({ status: 200, description: 'Horarios obtenidos correctamente' })
  @ApiResponse({ status: 404, description: 'Horarios no encontrados' })
  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  async findAll(@Req() req: RequestWithUser) {
    const schedules = await this.scheduleService.findAll(req.user);
    return {
      schedules
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un horario por ID' })
  @ApiResponse({ status: 200, description: 'Horario obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  async findOne(@Param('id', MongoIdValidationPipe) id: string) {
    const schedule = await this.scheduleService.findOne(id);
    return {
      schedule
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un horario por ID' })
  @ApiResponse({ status: 200, description: 'Horario actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Req() req: RequestWithUser
  ) {
    const schedule = await this.scheduleService.update(id, updateScheduleDto, req.user);
    return {
      message: 'Horario actualizado correctamente',
      schedule
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un horario por ID' })
  @ApiResponse({ status: 200, description: 'Horario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id', MongoIdValidationPipe) id: string,
    @Req() req: RequestWithUser
  ) {
    await this.scheduleService.remove(id, req.user);
    return {
      message: 'Horario eliminado correctamente'
    };
  }
}
