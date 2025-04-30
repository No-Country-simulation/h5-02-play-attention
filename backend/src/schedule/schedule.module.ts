import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { LeadsModule } from '../leads/leads.module';
import { UsersModule } from '../users/users.module';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { Leads, LeadsSchema } from '../leads/schema/leads.model';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Schedule.name,schema:ScheduleSchema},
      {name:Leads.name,schema:LeadsSchema},
      {name:User.name,schema:UserSchema}]),
  JwtModule,
LeadsModule,
UsersModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports:[ScheduleService]
})
export class ScheduleModule {}
