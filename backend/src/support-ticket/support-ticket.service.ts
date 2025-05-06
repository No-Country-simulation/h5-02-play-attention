import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SupportTicketRepository } from './support-ticket.repository';
import { ISupportTicketService } from './interfaces/support-ticket.service.int';
import {
  AdminGenerateSupportTicketDto,
  UserGenerateSupportTicketDto,
} from './dto/generate-ticket.dto';
import { SupportTickets } from './schema/support-ticket.schema';
import { UsersService } from '../users/users.service';
import { GetTicketsFilterDto } from './dto/get-ticket.dto';
import { PaginationResponseDto } from '../common/dtos/pagination.dto';
import { UpdateSupportTicketDto } from './dto/update-ticket.dto';
import { SUP_TICKETS } from 'src/system-events/event-names';

@Injectable()
export class SupportTicketService implements ISupportTicketService {
  private logger = new Logger('TicketService');
  constructor(
    private readonly _repository: SupportTicketRepository,
    private readonly _userService: UsersService,
    private readonly _emitter: EventEmitter2,
  ) {}

  async userCreateSupportTicket(
    userId: string,
    dto: UserGenerateSupportTicketDto,
  ): Promise<{ ok: boolean }> {
    await this._userService.findById(userId);
    try {
      const newTicket = await this._repository.createSupportTicket({
        ...dto,
        created_by: userId,
        ticket_origin: 'user_plataform',
        user_id: userId,
      });
      this._emitter.emit(SUP_TICKETS.USER_CREATED, newTicket);
      return { ok: true };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createSupportTicket(
    createdBy: string,
    dto: AdminGenerateSupportTicketDto,
  ): Promise<SupportTickets> {
    if (!!dto.user_id) {
      await this._userService.findById(dto.user_id);
    }
    try {
      return await this._repository.createSupportTicket({
        ...dto,
        created_by: createdBy,
      });
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async adminGetOne(ticketID: string): Promise<SupportTickets> {
    const ticket = this._repository.findSupportTicket(ticketID);
    if (!ticket) throw new NotFoundException('Suppport Ticket not found');
    return ticket;
  }

  async adminGetMany(
    queryDto: GetTicketsFilterDto,
  ): Promise<PaginationResponseDto<SupportTickets>> {
    const { page, take } = queryDto;
    try {
      const [countFiltered, data] = await Promise.all([
        this._repository.countFiltered(queryDto),
        this._repository.findFilteredTickets(queryDto),
      ]);
      return this.buildPaginationResponse<SupportTickets>(
        data,
        take,
        countFiltered,
        page,
      );
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async adminUpdate(
    adminId: string,
    ticketID: string,
    updateDto: UpdateSupportTicketDto,
  ): Promise<SupportTickets> {
    await this._userService.findById(adminId);
    await this.adminGetOne(ticketID);
    //Add more validations if needed to ensure admin can edit only allowed tickets
    try {
      const updated = await this._repository.updateSupportTicket(ticketID, {
        ...updateDto,
        updated_by: adminId,
      });
      return updated;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException();
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
