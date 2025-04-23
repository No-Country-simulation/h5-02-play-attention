import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EngagementService } from './engagements.service';
import { GenerateEngagementDto } from './dto/generate-engagement.dto';
import { ResponseEngagementDto } from './dto/update-engagement.dto';
import {
  EngagementPaginationDto,
  EngagementResponseDto,
} from './dto/response-engagement.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/isMongoIdValidation.pipe';
import { QueryPaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Engagements')
@Controller('/api/engagements')
export class EngagementsController {
  constructor(private readonly _service: EngagementService) {}

  @Get('lead/:leadId')
  @ApiOkResponse({ type: EngagementPaginationDto })
  getEngagementsByLeadId(
    @Param('leadId', MongoIdValidationPipe) leadId: string,
    @Query() pag: QueryPaginationDto,
  ) {
    return this._service.getEngagementsByLeadId(leadId, pag.take, pag.page);
  }

  @Get(':itemId')
  @ApiOkResponse({ type: EngagementResponseDto })
  getEngagementItem(@Param('itemId', MongoIdValidationPipe) itemId: string) {
    return this._service.getEngagement(itemId);
  }

  //TODO: add UserId to creation
  @Post('')
  @ApiCreatedResponse({ type: EngagementResponseDto })
  createEngagementItem(@Body() dto: GenerateEngagementDto) {
    return this._service.generateEngagement(dto);
  }

  // TODO: replace 'system' with current userId
  @Put('response/:itemId')
  @ApiOkResponse({ type: EngagementResponseDto })
  updateResponse(
    @Param('itemId', MongoIdValidationPipe) itemId: string,
    @Body() dto: ResponseEngagementDto,
  ) {
    return this._service.updateEngagement(itemId, dto, 'system');
  }
}
