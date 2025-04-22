import { GenerateEngagementDto } from '../dto/generate-engagement.dto';
import { UpdateEngagementDto } from '../dto/update-engagement.dto';
import { Engagements } from '../schema/engagements.schema';

export interface IEngagementService {
  generateEngagement(
    generateEngagementItemDto: GenerateEngagementDto,
  ): Promise<Engagements>;

  getEngagementsByLeadId(leadId: string): Promise<Engagements[]>;

  getEngagement(itemId: string): Promise<Engagements>;

  updateEngagement(
    itemId: string,
    dto: UpdateEngagementDto,
    userId: string,
  ): Promise<Engagements>;
}
