import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LeadsDocument = HydratedDocument<Leads>;

@Schema()
export class Leads {

    @Prop({
        type: String,
        required: true,
    })
    fullname: string;

    @Prop({
        type: String,
        required: false,
    })
    company: string;

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
        enum: ['Profesional', 'Individuo', 'Empresa']
    })
    service: string;

    @Prop({
        type: String,
        required: true,
    })
    message: string;

    @Prop({
        type: String,
        required: true,
        enum: ['active', 'pending', 'completed']
    })
    status: string;
}

export const LeadsSchema = SchemaFactory.createForClass(Leads);