import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Engagements } from './schema/engagements.schema';
import { IEngagementsRepository } from './interfaces/engagements.repository.int';
import { GenerateEngagementDto } from './dto/generate-engagement.dto';

@Injectable()
export class EngagementsRepository implements IEngagementsRepository {
  constructor(
    @InjectModel(Engagements.name)
    private readonly engagementsModel: Model<Engagements>,
  ) {}

  async createEngagement(
    createHistoryDto: GenerateEngagementDto,
  ): Promise<Engagements> {
    const engagements = new this.engagementsModel({
      ...createHistoryDto,
      lead: createHistoryDto.lead_id,
    });
    return engagements.save();
  }

  async findEngagementsByLeadId(leadId: string): Promise<Engagements[]> {
    return this.engagementsModel.find({ lead: leadId }).exec();
  }

  async findEngagement(id: string): Promise<Engagements> {
    return this.engagementsModel.findOne({ _id: id });
  }

  async updateEngagement(
    id: string,
    updateData: Partial<GenerateEngagementDto>,
  ): Promise<Engagements> {
    return this.engagementsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteEngagement(id: string): Promise<boolean> {
    const result = await this.engagementsModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
