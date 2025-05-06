import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  NOTIFICATION_TYPE,
  NotificationType,
} from '../notifications.constants';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    required: true,
    type: String,
    enum: NOTIFICATION_TYPE,
    default: 'Info',
  })
  type: NotificationType;

  @Prop({ required: true, trim: true, type: String })
  title: string;

  @Prop({ required: true, trim: true, type: String })
  message: string;

  @Prop({ required: true, type: Boolean, default: false })
  read: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: false, type: Object })
  metadata?: Record<string, any>;

  @Prop({ required: false, type: String })
  redirect_url?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
