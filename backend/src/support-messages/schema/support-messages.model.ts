import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type SupportMessagesDocument = HydratedDocument<SupportMessages>

@Schema({ timestamps: true})
export class SupportMessages {

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    })
    user_id: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
    })
    text: string;

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: 'SupportTickets'
    })
    ticket_id: Types.ObjectId;
}

export const SupportMessagesSchema = SchemaFactory.createForClass(SupportMessages);
