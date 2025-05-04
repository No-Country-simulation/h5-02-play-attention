import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";



export type NotificationDocument = HydratedDocument<Notification>
@Schema({ timestamps: true })
export class Notification extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Lead' })
    leadId: Types.ObjectId;

    @Prop({ required: true, default: false })
    view: boolean;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
