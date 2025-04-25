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
}
