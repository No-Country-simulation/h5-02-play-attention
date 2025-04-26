import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  COMERCIAL = 'Comercial',
}
export enum Services {
  PROFESIONAL = 'Profesional',
  EMPRESA = 'Empresa',
  INDIVIDUAL = 'Individuo',
  SYSTEM = 'System',
}

export type ServiceType = `${Services}`;
export type UserRoleType = `${UserRole}`;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, type: String })
  fullname: string;

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
