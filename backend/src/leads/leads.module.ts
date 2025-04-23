import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Leads, LeadsSchema } from './schema/leads.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Leads.name,
        schema: LeadsSchema
      }
    ])
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService]
})
export class LeadsModule {}
