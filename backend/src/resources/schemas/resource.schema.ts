import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';


export type RespurceDocument = HydratedDocument<Resource>
export enum ResourceType {
  VIDEO = 'video',
  IMAGE = 'image',
  PDF = 'pdf',
}

@Schema({ timestamps: true })
export class Resource extends Document {
  @Prop({ required: true, type: String,trim:true })
  title: string;

  @Prop({ required: true, type: String,trim:true })
  description: string;

  @Prop({ required: true, type: String,trim:true })
  url: string;

  @Prop({ required: true, enum: ResourceType })
  type: ResourceType;

  @Prop({ required: true, type: Boolean, default: false })
  published: boolean;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);