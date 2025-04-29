import { GenerateEngagementDto } from '../dto/generate-engagement.dto';
import { Engagements } from '../schema/engagements.schema';

export interface IEngagementsRepository {
  createEngagement(
    createHistoryDto: GenerateEngagementDto,
  ): Promise<Engagements>;
  findEngagementsByLeadId(
    leadId: string,
    take?: number,
    page?: number,
  ): Promise<Engagements[]>;
  countEngagementsById(leadId: string): Promise<number>;
  findEngagement(id: string): Promise<Engagements>;
  updateEngagement(
    id: string,
    updateData: Partial<GenerateEngagementDto>,
  ): Promise<Engagements>;
  deleteEngagement(id: string): Promise<boolean>;
}
