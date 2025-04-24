import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto, CreateLeadFromLandingDto, UpdateLeadDto } from './dto/leads.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Leads } from './schema/leads.model';
import { Model } from 'mongoose';
import { EngagementService } from 'src/engagements/engagements.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LeadCreatedEvent } from 'src/system-events/lead-created.event';
import { LEAD_EVENTS } from 'src/system-events/event-names';

@Injectable()
export class LeadsService {

    constructor(
        @InjectModel(Leads.name)
        private leadsModel: Model<Leads>,
        @Inject(forwardRef(() => EngagementService))
        private readonly _engagementService: EngagementService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async createLead(createLeadDto: CreateLeadDto) {
        const newLead = new this.leadsModel(createLeadDto);
        return newLead.save();
    }

    async createFromLanding(dto: CreateLeadFromLandingDto){
        const newLead = await this.createLead({...dto, origen:'Sitio web', status: 'Nuevo'});

        await this._engagementService.generateEngagementFormLanding({lead_id:newLead._id.toString(), detail: dto.message });

        this.eventEmitter.emit(
            LEAD_EVENTS.LEAD_CREATED,
            new LeadCreatedEvent(newLead._id.toString(), dto.email, dto.fullname, dto.message)
        );
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
        const leadUpdated = await this.leadsModel.findByIdAndUpdate(id, updateLeadDto).exec();
        if(!leadUpdated) {
            throw new NotFoundException(`No se encontró lead con id: ${id}`)
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
