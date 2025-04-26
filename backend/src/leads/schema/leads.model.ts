import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { LEAD_ORIGINS, LEAD_SERVICE_OPTIONS, LEAD_STATUS } from "../leads.constants";

export type LeadsDocument = HydratedDocument<Leads>;

@Schema({timestamps: true})
export class Leads {

    @Prop({
        type: String,
        required: true,
    })
    fullname: string;

     @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'engagements'
    })
    contact_id: Types.ObjectId[];

    @Prop({
        type: String,
        required: false,
    })
    company?: string;

    @Prop({
        type: String,
        required: true,
    })
    phone: string;

    @Prop({
        type: String,
        required: true,
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        enum: LEAD_SERVICE_OPTIONS
    })
    service: string;

    @Prop({
        type: String,
        required: false,
    })
    notes?: string;

    @Prop({
        type: String,
        required: true,
        enum: LEAD_STATUS,
        default: 'Nuevo'
    })
    status: string;

    @Prop({
        type: String,
        required: false,
        enum: LEAD_ORIGINS
    })
    origen: string;

    @Prop({
        type: String,
        required: true
    })
    relation: string;

    @Prop({
        type: String,
        required: false
    })
    message: string;
}

export const LeadsSchema = SchemaFactory.createForClass(Leads);