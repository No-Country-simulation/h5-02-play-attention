import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadDto, CreateLeadFromLandingDto, UpdateLeadDto } from './dto/leads.dto';
import { Leads } from './schema/leads.model';
import { EngagementService } from '../engagements/engagements.service';
import { LeadCreatedEvent } from '../system-events/lead-created.event';
import { LEAD_EVENTS } from '../system-events/event-names';
import { AuthService } from '../auth/auth.service';
import { Services, UserRole } from '../auth/auth.enum';

@Injectable()
export class LeadsService {

    constructor(
        @InjectModel(Leads.name)
        private leadsModel: Model<Leads>,
        @Inject(forwardRef(() => EngagementService))
        private readonly _engagementService: EngagementService,
        private readonly eventEmitter: EventEmitter2,
        private readonly authService:AuthService
    ) {}

    async createLead(createLeadDto: CreateLeadDto) {
        const newLead = await this.leadsModel.create(createLeadDto);
        
        this.eventEmitter.emit(
            LEAD_EVENTS.LEAD_CREATED,
            new LeadCreatedEvent(newLead._id.toString(), createLeadDto.email, createLeadDto.fullname)
        );
        return newLead;
    }

    async createFromLanding(dto: CreateLeadFromLandingDto){
        const newLead = await this.createLead({...dto, origen:'Sitio web', status: 'Nuevo'});

        await this._engagementService.generateEngagementFormLanding({lead_id:newLead._id.toString(), detail: dto.message });
        return {ok: true,}
    }

    async findAll(): Promise<Leads[]>{
        return this.leadsModel.find().exec();
    }

    async findById(id: string) {
        const getLead = this.leadsModel.findById(id).exec();
        if(!getLead) {
            throw new NotFoundException(`No se halló un lead con id: ${id}`)
        }
        return getLead;
    }

    async updateLead(id: string, updateLeadDto: UpdateLeadDto) {
        const leadUpdated = await this.leadsModel.findByIdAndUpdate(id, updateLeadDto, {new: true}).exec();
        if(!leadUpdated) {
            throw new NotFoundException(`No se encontró lead con id: ${id}`)
        }
        if(updateLeadDto.status === 'Cliente'){
            await this.authService.registerFromLead(
                leadUpdated.email,
                UserRole.USER,
                leadUpdated.service as Services
            )
        }
       
        return leadUpdated;
    }

    async deleteLead(id: string) {
        const leadDeleted = await this.leadsModel.findByIdAndDelete(id);
        if(!leadDeleted) {
            throw new NotFoundException(`No se halló el lead con id: ${id}`)
        }
        return 'Se eliminó el Lead'
    }
}
