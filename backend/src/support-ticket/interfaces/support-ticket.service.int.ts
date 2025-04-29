import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';
import {
  UserGenerateSupportTicketDto,
  GenerateSupportTicketDto,
} from '../dto/generate-ticket.dto';
import { GetTicketsFilterDto } from '../dto/get-ticket.dto';
import { SupportTickets } from '../schema/support-ticket.schema';
import { UpdateSupportTicketDto } from '../dto/update-ticket.dto';

export interface ISupportTicketService {
  userCreateSupportTicket(
    userId: string,
    dto: UserGenerateSupportTicketDto,
  ): Promise<{ ok: boolean }>;

  createSupportTicket(
    createdBy: string,
    dto: GenerateSupportTicketDto,
  ): Promise<SupportTickets>;

  adminGetOne(ticketID: string): Promise<SupportTickets>;
  adminGetMany(
    queryDto: GetTicketsFilterDto,
  ): Promise<PaginationResponseDto<SupportTickets>>;

  adminUpdate(
    adminId: string,
    ticketId: string,
    updateDto: UpdateSupportTicketDto,
  ): Promise<SupportTickets>;
}
