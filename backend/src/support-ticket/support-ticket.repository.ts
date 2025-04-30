import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ISupportTicketsRepository } from './interfaces/support-ticket.repository.int';
import { SupportTickets } from './schema/support-ticket.schema';
import { GenerateSupportTicketDto } from './dto/generate-ticket.dto';
import { GetTicketsFilterDto } from './dto/get-ticket.dto';
import { UpdateSupportTicketsIntDto } from './dto/update-ticket.dto';

@Injectable()
export class SupportTicketRepository implements ISupportTicketsRepository {
  constructor(
    @InjectModel(SupportTickets.name)
    private readonly model: Model<SupportTickets>,
  ) {}

  async createSupportTicket(
    dto: GenerateSupportTicketDto,
  ): Promise<SupportTickets> {
    const newTicket = new this.model({ ...dto });
    return await newTicket.save();
  }

  async findSupportTicket(id: string): Promise<SupportTickets> {
    return await this.model.findOne({ _id: id }).populate('messages');
  }

  async findFilteredTickets(
    queryDto: GetTicketsFilterDto,
  ): Promise<SupportTickets[]> {
    const { page, take } = queryDto;
    const _query = { ...queryDto };

    if (!page && !take) {
      _query.page = 0;
      _query.take = -1;
    }
    _query.page = page ? page : 1;
    _query.take = take ? take : 10;
    const query = this.getAllQueryBuilder(queryDto);

    return await this.model
      .find(query)
      .skip((_query.page - 1) * _query.take)
      .sort({ [_query.sort_by]: _query.order === 'asc' ? 1 : -1 })
      .limit(_query.take)
      .exec();
  }

  async findSupportTicketsByUser(
    userId: string,
    take: number = 10,
    page: number = 1,
  ): Promise<SupportTickets[]> {
    return await this.model
      .find({ lead: userId })
      .skip((page - 1) * take)
      .sort({ _id: 1 })
      .limit(take)
      .exec();
  }

  async updateSupportTicket(
    id: string,
    updateData: Partial<UpdateSupportTicketsIntDto>,
  ): Promise<SupportTickets> {
    const newData = {
      ...updateData,
      user_id: new Types.ObjectId(updateData.user_id),
      asigned_to: new Types.ObjectId(updateData.assigned_to),
    };
    return this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
  }

  async deleteSupportTicket(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return !!result;
  }
  async countSupportTicketsByUser(userId: string): Promise<number> {
    return await this.model.countDocuments({ user_id: userId });
  }

  async countFiltered(queryDto: GetTicketsFilterDto): Promise<number> {
    return await this.model.countDocuments(this.getAllQueryBuilder(queryDto));
  }

  private getAllQueryBuilder(queryDto: GetTicketsFilterDto) {
    const { ...filters } = queryDto;

    const query: Record<string, any> = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.status) {
      query.status = filters.status;
    }
    return query;
  }
}
