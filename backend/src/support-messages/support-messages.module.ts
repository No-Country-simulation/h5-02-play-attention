import { Module } from '@nestjs/common';
import { SupportMessagesService } from './support-messages.service';
import { SupportMessagesController } from './support-messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportMessages, SupportMessagesSchema } from './schema/support-messages.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SupportMessages.name,
        schema: SupportMessagesSchema,
      }
    ])
  ],
  providers: [SupportMessagesService],
  controllers: [SupportMessagesController]
})
export class SupportMessagesModule {}
