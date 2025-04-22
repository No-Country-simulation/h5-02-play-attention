import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IEngagementService } from './interfaces/engagements.service.int';
import { GenerateEngagementDto } from './dto/generate-engagement.dto';
import { Engagements } from './schema/engagements.schema';
import { EngagementsRepository } from './engagements.repository';
import { UpdateEngagementDto } from './dto/update-engagement.dto';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class EngagementService implements IEngagementService {
  private readonly logger = new Logger('EngagementsService');

  constructor(
    private readonly _repository: EngagementsRepository,
    private readonly _leadService: LeadsService,
  ) {}

  async generateEngagement(
    generateEngagementDto: GenerateEngagementDto,
  ): Promise<Engagements> {
    try {
      await this._leadService.findById(generateEngagementDto.lead_id);
      const engagementsItem = await this._repository.createEngagement(
        generateEngagementDto,
      );
      return engagementsItem;
    } catch (error) {
      this.logger.error('Error at creating', error.stack);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Lead not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async getEngagementsByLeadId(leadId: string): Promise<Engagements[]> {
    try {
      await this._leadService.findById(leadId);
      const engagements =
        await this._repository.findEngagementsByLeadId(leadId);
      return engagements;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Lead not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async getEngagement(itemId: string): Promise<Engagements> {
    try {
      const engagementsItem = await this._repository.findEngagement(itemId);
      if (!engagementsItem) {
        throw new NotFoundException();
      }
      return engagementsItem;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Engagement not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async updateEngagement(
    itemId: string,
    dto: UpdateEngagementDto,
    userId: string,
  ): Promise<Engagements> {
    await this.getEngagement(itemId);
    const newData = { ...dto, updated_by: userId };
    try {
      const leadUpdated = await this._repository.updateEngagement(
        itemId,
        newData,
      );
      return leadUpdated;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }
}
