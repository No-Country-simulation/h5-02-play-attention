import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schema/schedule.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { LeadsService } from '../leads/leads.service';
import {  UserDocument } from '../users/schema/user.schema';


@Injectable()
export class ScheduleService {
  constructor( 
    @InjectModel(Schedule.name)
    private scheduleModel:Model<Schedule>,
    private leadsService:LeadsService

  ){}
  async create(createScheduleDto: CreateScheduleDto,user:string) {
    const {lead,startTime,endTime,status,description,title,place} = createScheduleDto

    const leadExist = await this.leadsService.findById(lead)
    if(!leadExist){
throw new NotFoundException("No se encontro el lead")
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const currentDate = new Date()

    if (startDate >= endDate) {
      throw new BadRequestException("La fecha de inicio debe ser menor que la fecha de fin");
    }
    if(startDate < currentDate){
  
      throw new BadRequestException("La fecha de inicio no puede ser en el pasado")
    }

    const schedule = await this.scheduleModel.findOne({
          startTime: { $lt: endDate },
          endTime: { $gt: startDate },
          user
    });

    if(schedule){
      throw new BadRequestException("Ya existe una cita en ese horario")
    }

    const newSchedule=await this.scheduleModel.create({
      title,
      description,
      lead,
      startTime: startDate,
      endTime: endDate,
        status,
        user,
        place
    })

    await newSchedule.save()

    return newSchedule;
  }

  async findAll(user:string) {

    const schedules = await this.scheduleModel.find({user})
      .populate('lead')
      .populate('user', '-password')
      .select('-__v');
    return schedules;
  }

  async findOne(id: string) {
    const schedule = await this.scheduleModel.findById(id)
      .populate('lead')
      .select('-__v');
    if(!schedule){
      throw new NotFoundException("No se encontro el horario");
    }
    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto, user:string) {
    const userId = new Types.ObjectId(user)
    const schedule = await this.scheduleModel.findById(id).populate('lead')
    if(!schedule){
      throw new NotFoundException("No se encontro el horario");
    }

    if(schedule.user.toString() !== userId.toString()){
      throw new BadRequestException("No tienes permisos para actualizar este horario");
    }

    const {lead,startTime,endTime,status,description,title,place} = updateScheduleDto

const startDate = new Date(startTime || schedule.startTime);
    const endDate = new Date(endTime || schedule.endTime);
    const currentDate = new Date()

    if(startDate >= endDate){
      throw new BadRequestException("La fecha de inicio debe ser menor que la fecha de fin");
    }
    if(startDate < currentDate){
      throw new BadRequestException("La fecha de inicio no puede ser en el pasado");
    }
      const scheduleExist:Schedule = await this.scheduleModel.findOne({
          startTime: { $lt: endDate },
          endTime: { $gt: startDate },
          user
    });
 
if (scheduleExist && scheduleExist._id.toString() !== id) {
  throw new BadRequestException("Ya existe una cita en ese horario");
}

    schedule.startTime = startTime
    schedule.endTime = endTime
    schedule.status = status
    schedule.description = description
    schedule.title = title
    schedule.place = place
    await schedule.save()
    return schedule;
  }
  
  async remove(id: string, user: string) {
  
    const schedule = await this.scheduleModel.findById(id);
    if (!schedule) {
      throw new BadRequestException(`Horario con ID ${id} no encontrado`);
    }
    if(schedule.user.toString()!==user){
      throw new BadRequestException("No tienes permisos para eliminar este horario")
    }
    await this.scheduleModel.deleteOne({ _id: id },{new:true});
    return schedule;
  }
}
