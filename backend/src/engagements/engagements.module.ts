import { forwardRef, Module } from '@nestjs/common';
import { EngagementsController } from './engagements.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsModule } from 'src/leads/leads.module';
import { Engagements, EngagementsSchema } from './schema/engagements.schema';
import { EngagementService } from './engagements.service';
import { EngagementsRepository } from './engagements.repository';

@Module({
  controllers: [EngagementsController],
  imports: [
    forwardRef(() => LeadsModule),
    MongooseModule.forFeature([
      {
        name: Engagements.name,
        schema: EngagementsSchema,
      },
    ]),
  ],
  providers: [EngagementService, EngagementsRepository],
  exports: [EngagementService],
})
export class EngagementsModule {}
