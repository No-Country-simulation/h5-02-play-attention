import { Module } from '@nestjs/common';
import { DevToolsService } from './dev-tools.service';
import { DevToolsController } from './dev-tools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Engagements,
  EngagementsSchema,
} from 'src/engagements/schema/engagements.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Leads, LeadsSchema } from 'src/leads/schema/leads.model';

@Module({
  providers: [DevToolsService],
  controllers: [DevToolsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Engagements.name,
        schema: EngagementsSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Leads.name,
        schema: LeadsSchema,
      },
    ]),
  ],
})
export class DevToolsModule {}
