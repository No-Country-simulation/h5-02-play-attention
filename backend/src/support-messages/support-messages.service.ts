import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupportMessages } from './schema/support-messages.model';
import { Model } from 'mongoose';
import { CreateSupportMessagesDto, UpdateSupportMessageDto } from './dto/support-messages.dto';

@Injectable()
export class SupportMessagesService {

    constructor(
        @InjectModel(SupportMessages.name)
        private supportMessagesModel: Model<SupportMessages>
    ) {}

    async create(createSupportMessagesDto: CreateSupportMessagesDto) {
        const newMessage = new this.supportMessagesModel(createSupportMessagesDto);
        return newMessage.save();
    }

    async getAll() {
        return this.supportMessagesModel.find().exec();
    }

    async getById(id: string) {
        const getMessage = this.supportMessagesModel.findById(id).exec();
        if(!getMessage) {
            throw new NotFoundException(`No se encontró mensaje con ID ${id}`)
        }
        return getMessage;
    }

    async editMessage(id: string, body: UpdateSupportMessageDto) {
        const messageUpdated = await this.supportMessagesModel.findByIdAndUpdate(id, body, {new: true});
        if(!messageUpdated) {
            throw new NotFoundException(`No se encontró mensaje con ID ${id}`)
        }
        return messageUpdated.save();
    }   

    async removeMessage(id: String) {
        const deletedMessage = await this.supportMessagesModel.findByIdAndDelete(id);
        return 'Se eliminó el mensaje'
    }
}
