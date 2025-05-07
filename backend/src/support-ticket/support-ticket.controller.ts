import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { MongoIdValidationPipe } from 'src/common/pipes/isMongoIdValidation.pipe';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import {
  ResponseSupportTicketDto,
  SupportTicketPaginationDto,
} from './dto/response-ticket.dto';
import {
  AdminGenerateSupportTicketDto,
  UserGenerateSupportTicketDto,
} from './dto/generate-ticket.dto';
import { GetTicketsFilterDto } from './dto/get-ticket.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/common/decorators/getUserId';
import { UpdateSupportTicketDto } from './dto/update-ticket.dto';

@Controller('api/support-tickets')
export class SupportTicketController {
  constructor(private readonly _service: SupportTicketService) {}


  @Get("/user")
  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: ResponseSupportTicketDto })
  getByUser(@GetUser() userId: string){
    return this._service.getByUser(userId);
  }



  @Get(':ticketId')
  @ApiOkResponse({ type: ResponseSupportTicketDto })
  adminGetOne(@Param('ticketId', MongoIdValidationPipe) ticketId: string) {
    return this._service.adminGetOne(ticketId);
  }

  @Get()
  @ApiOkResponse({ type: SupportTicketPaginationDto })
  adminGetAll(@Query() filtersDto: GetTicketsFilterDto) {
    return this._service.adminGetMany(filtersDto);
  }

  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  @Post('admin')
  adminCreate(
    @GetUser() userId: string,
    @Body() createDto: AdminGenerateSupportTicketDto,
  ) {
    return this._service.createSupportTicket(userId, createDto);
  }

  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  @Post('platform')
  userCreate(
    @GetUser() userId: string,
    @Body() createDto: UserGenerateSupportTicketDto,
  ) {
    return this._service.userCreateSupportTicket(userId, createDto);
  }

  @ApiBearerAuth('playAttentionToken')
  @UseGuards(AuthGuard)
  @Put(':ticketId')
  adminUpdate(
    @GetUser() adminId: string,
    @Param('ticketId', MongoIdValidationPipe) ticketId: string,
    @Body() createDto: UpdateSupportTicketDto,
  ) {
    return this._service.adminUpdate(adminId, ticketId, createDto);
  }
}
