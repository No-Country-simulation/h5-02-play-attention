import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type SupportMessagesDocument = HydratedDocument<SupportMessages>

@Schema({ timestamps: true})
export class SupportMessages {

    @Prop({
        type: String,
        required: true
    })
    user_id: Types.ObjectId;

    @Prop({
        type: String,
        required: true
    })
    text: string;
}

export const SupportMessagesSchema = SchemaFactory.createForClass(SupportMessages);
