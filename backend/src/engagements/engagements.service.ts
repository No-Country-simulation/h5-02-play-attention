import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { PaginationResponseDto } from '../common/dtos/pagination.dto';

@Injectable()
export class EngagementService implements IEngagementService {
  private readonly logger = new Logger('EngagementsService');

  constructor(
    private readonly _repository: EngagementsRepository,
    @Inject(forwardRef(() => LeadsService))
    private readonly _leadService: LeadsService,
  ) {}

  async generateEngagement(
    generateEngagementDto: GenerateEngagementDto,
    userId?: string,
  ): Promise<Engagements> {
    try {
      await this._leadService.findById(generateEngagementDto.lead_id);
      const engagementsItem = await this._repository.createEngagement({
        ...generateEngagementDto,
        created_by: userId ? userId : 'system',
      });
      return engagementsItem;
    } catch (error) {
      this.logger.error('Error at creating', error.stack);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Lead not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async getEngagementsByLeadId(
    leadId: string,
    take: number = 10,
    page: number = 1,
  ): Promise<PaginationResponseDto<Engagements>> {
    try {
      await this._leadService.findById(leadId);
      const [engagements, count] = await Promise.all([
        this._repository.findEngagementsByLeadId(leadId, take, page),
        this._repository.countEngagementsById(leadId),
      ]);

      return this.buildPaginationResponse<Engagements>(
        engagements,
        take,
        count,
        page,
      );
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

  private buildPaginationResponse<T>(
    data: T[],
    take: number,
    count: number,
    page: number,
  ): PaginationResponseDto<T> {
    const lastPage = Math.ceil(count / take);

    return {
      data,
      last_page: lastPage,
      next_page: page < lastPage ? page + 1 : undefined,
      current_page: page,
      prev_page: page > 1 ? page - 1 : undefined,
      page_records: data.length,
      total_records: count,
    };
  }
}
