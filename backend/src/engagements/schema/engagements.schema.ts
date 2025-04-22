import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { LEAD_CONTACT_TYPES } from '../engagements.constants';
import { Leads } from '../../leads/schema/leads.model';
import { EngagementResponseDto } from '../dto/response-engagement.dto';

export type EngagementsDocument = HydratedDocument<Engagements>;

@Schema()
export class Engagements {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Leads.name,
    required: true,
  })
  lead: Leads;
  @Prop({
    type: String,
    required: true,
    enum: LEAD_CONTACT_TYPES,
  })
  contact_type: string;
  @Prop({
    type: Date,
    required: true,
  })
  contact_date: Date;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  subject: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  detail: string;
  @Prop({
    type: String,
    required: false,
    trim: true,
  })
  response?: string;
  @Prop({
    type: String,
    required: true,
    default: 'system',
  })
  created_by: string;
  @Prop({
    type: Types.ObjectId,
    required: false,
  })
  updated_by?: string;
}

export const EngagementsSchema = SchemaFactory.createForClass(Engagements).set(
  'toJSON',
  {
    transform: (_, ret) => {
      return plainToInstance(EngagementResponseDto, ret, {
        excludeExtraneousValues: true,
      });
    },
  },
);
