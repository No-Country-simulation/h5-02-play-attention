import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupportMessages } from './schema/support-messages.model';
import { Model } from 'mongoose';
import {
  CreateSupportMessagesDto,
  UpdateSupportMessageDto,
} from './dto/support-messages.dto';
import { SupportTicketService } from 'src/support-ticket/support-ticket.service';

@Injectable()
export class SupportMessagesService {
  constructor(
    @InjectModel(SupportMessages.name)
    private supportMessagesModel: Model<SupportMessages>,
    private supportTicketService: SupportTicketService,
  ) {}

  async create(createSupportMessagesDto: CreateSupportMessagesDto) {
    const newMessage = new this.supportMessagesModel(createSupportMessagesDto);
    return newMessage.save();
  }

  async getAll() {
    return this.supportMessagesModel.find().exec();
  }

  async getByTicketId(ticketId: string) {
    await this.supportTicketService.adminGetOne(ticketId);
    if(!ticketId) {
        throw new NotFoundException(`No se encontró Ticket con ID ${ticketId}`)
    }
    const getMessages = await this.supportMessagesModel.find({ticket_id: ticketId}).exec();
    if (getMessages.length === 0) {
      throw new NotFoundException(`Aún no hay mensajes`);
    }
    return getMessages;
  }

  async editMessage(id: string, body: UpdateSupportMessageDto) {
    const messageUpdated = await this.supportMessagesModel.findByIdAndUpdate(
      id,
      { text: body.text },
      { new: true },
    );
    if (!messageUpdated) {
      throw new NotFoundException(`No se encontró mensaje con ID ${id}`);
    }
    return messageUpdated.save();
  }

  async removeMessage(id: String) {
    const deletedMessage =
      await this.supportMessagesModel.findByIdAndDelete(id);
    return 'Se eliminó el mensaje';
  }
}
