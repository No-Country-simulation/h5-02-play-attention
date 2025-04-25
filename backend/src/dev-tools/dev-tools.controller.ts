import { Controller, Get } from '@nestjs/common';
import { DevToolsService } from './dev-tools.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('DevTools')
@Controller()
export class DevToolsController {
  constructor(private readonly _devService: DevToolsService) {}

  @Get('clean-tables')
  @ApiOperation({
    summary:
      'Deletes all data into Engagements, Users, Leads tables. In that specific order',
  })
  cleanTables() {
    return this._devService.cleanAll();
  }

  @Get('clean-eng')
  @ApiOperation({
    summary: 'Deletes all data into Engagements.',
  })
  cleanEngagements() {
    return this._devService.deleteEngagements();
  }

  @Get('clean-users')
  @ApiOperation({
    summary: 'Deletes all data into, Users.',
  })
  cleanUsers() {
    return this._devService.deleteUsers();
  }

  @Get('clean-leads')
  @ApiOperation({
    summary: 'Deletes all data into Leads tables.',
  })
  cleanLeads() {
    return this._devService.deleteLeads();
  }
}
