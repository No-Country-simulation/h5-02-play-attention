import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum Status {
    PENDING = "Pending",
    CANCELLED = "Cancelled",
    COMPLETED = "Completed",
}

export type StatusType = Status;

@Schema({ timestamps: true })
export class Schedule extends Document {
    @Prop({ required: true, trim: true, type: String })
    title: string;

    @Prop({ required: true, trim: true, type: String })
    description: string;

    @Prop({ required: true, trim: true, type: Types.ObjectId, ref: "Leads" })
    lead: Types.ObjectId;

    @Prop({ required: true, trim: true, type: Types.ObjectId, ref: "User" })
    user: Types.ObjectId;

    @Prop({ required: true, trim: true, type: Date })
    startTime: Date;

    @Prop({ required: true, trim: true, type: Date })
    endTime: Date;

    @Prop({ required: true, trim: true, enum: Status })
    status: StatusType;

    @Prop({ required: false, trim: true, type: String })
    place:string
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
