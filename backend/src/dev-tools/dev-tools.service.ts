import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Engagements } from 'src/engagements/schema/engagements.schema';
import { Leads } from 'src/leads/schema/leads.model';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class DevToolsService {
  private readonly logger = new Logger('DevToolsService');

  constructor(
    @InjectModel(Engagements.name)
    private readonly engagementsModel: Model<Engagements>,
    @InjectModel(Leads.name)
    private readonly leadsModel: Model<Leads>,
    @InjectModel(User.name)
    private readonly usersModel: Model<Leads>,
  ) {}
  async cleanAll() {
    try {
      await this.engagementsModel.deleteMany({});
      await this.usersModel.deleteMany({});
      await this.leadsModel.deleteMany({});
      return { ok: true };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Canot clean at least one table');
    }
  }

  async deleteEngagements() {
    try {
      await this.engagementsModel.deleteMany({});
      return { ok: true };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Canot clean at least one table');
    }
  }

  async deleteUsers() {
    try {
      await this.usersModel.deleteMany({});
      return { ok: true };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Canot clean at least one table');
    }
  }

  async deleteLeads() {
    try {
      await this.leadsModel.deleteMany({});
      return { ok: true };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Canot clean at least one table');
    }
  }
}
