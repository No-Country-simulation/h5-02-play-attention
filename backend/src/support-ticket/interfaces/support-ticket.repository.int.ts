import { GenerateSupportTicketDto } from '../dto/generate-ticket.dto';
import { GetTicketsFilterDto } from '../dto/get-ticket.dto';
import { UpdateSupportTicketsIntDto } from '../dto/update-ticket.dto';
import { SupportTickets } from '../schema/support-ticket.schema';

export interface ISupportTicketsRepository {
  createSupportTicket(
    createHistoryDto: GenerateSupportTicketDto,
  ): Promise<SupportTickets>;
  findFilteredTickets(queryDto: GetTicketsFilterDto): Promise<SupportTickets[]>;
  findSupportTicketsByUser(
    userId: string,
    take?: number,
    page?: number,
  ): Promise<SupportTickets[]>;
  findSupportTicket(id: string): Promise<SupportTickets>;
  updateSupportTicket(
    id: string,
    updateData: Partial<UpdateSupportTicketsIntDto>,
  ): Promise<SupportTickets>;
  deleteSupportTicket(id: string): Promise<boolean>;
  countSupportTicketsByUser(userId: string): Promise<number>;
  countFiltered(queryDto: GetTicketsFilterDto): Promise<number>;
}
