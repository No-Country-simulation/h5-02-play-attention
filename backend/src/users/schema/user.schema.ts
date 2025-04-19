import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export enum Services {
  PROFESIONAL = 'profesional',
  ENTERPRICE = 'enterprice',
  INDIVIDUAL = 'individual',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true, type: String })
  email: string;

  @Prop({ required: true, trim: true, type: String })
  password: string;

  @Prop({ required: false, type: Boolean, default: true })
  isActive: boolean;

  @Prop({ required: true, type: String, default: UserRole.USER })
  role: UserRole;

  @Prop({ required: true, type: String })
  service: Services;
}

export const UserSchema = SchemaFactory.createForClass(User);
