import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schema/schedule.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { LeadsService } from '../leads/leads.service';
import { User, UserDocument } from '../users/schema/user.schema';
import { Leads } from '../leads/schema/leads.model';

@Injectable()
export class ScheduleService {
  constructor( 
    @InjectModel(Schedule.name)
    private scheduleModel:Model<Schedule>,
    private leadsService:LeadsService

  ){}
  async create(createScheduleDto: CreateScheduleDto,user:UserDocument) {
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

  async findAll(user:UserDocument) {
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

  async update(id: string, updateScheduleDto: UpdateScheduleDto, user:UserDocument) {
    const schedule = await this.scheduleModel.findById(id).populate('lead')
    if(!schedule){
      throw new NotFoundException("No se encontro el horario");
    }
    if(schedule.user.toString() !== user._id.toString()){
      throw new BadRequestException("No tienes permisos para actualizar este horario");
    }
    return schedule;
  }
  
  async remove(id: string, user: UserDocument) {
    const schedule = await this.scheduleModel.findById(id);
    if (!schedule) {
      throw new BadRequestException(`Horario con ID ${id} no encontrado`);
    }
    if(schedule.user.toString() !== user._id.toString()){
      throw new BadRequestException("No tienes permisos para eliminar este horario")
    }
    await this.scheduleModel.deleteOne({ _id: id });
    return schedule;
  }
}
