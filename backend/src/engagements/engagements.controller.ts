import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EngagementService } from './engagements.service';
import { GenerateEngagementDto } from './dto/generate-engagement.dto';
import { ResponseEngagementDto } from './dto/update-engagement.dto';
import { EngagementResponseDto } from './dto/response-engagement.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/isMongoIdValidation.pipe';

@ApiTags('Engagements')
@Controller('/api/engagements')
export class EngagementsController {
  constructor(private readonly _service: EngagementService) {}

  @Get('lead/:leadId')
  @ApiOkResponse({ type: [EngagementResponseDto] })
  getEngagementsByLeadId(
    @Param('leadId', MongoIdValidationPipe) leadId: string,
  ) {
    return this._service.getEngagementsByLeadId(leadId);
  }

  @Get(':itemId')
  @ApiOkResponse({ type: EngagementResponseDto })
  getEngagementItem(@Param('itemId', MongoIdValidationPipe) itemId: string) {
    return this._service.getEngagement(itemId);
  }

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
