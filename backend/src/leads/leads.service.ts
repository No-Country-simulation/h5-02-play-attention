import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto, UpdateLeadDto } from './dto/leads.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Leads } from './schema/leads.model';
import { Model } from 'mongoose';

@Injectable()
export class LeadsService {

    constructor(
        @InjectModel(Leads.name)
        private leadsModel: Model<Leads>
    ) {}

    async createLead(createLeadDto: CreateLeadDto) {
        const newLead = new this.leadsModel(createLeadDto);
        return newLead.save();
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
