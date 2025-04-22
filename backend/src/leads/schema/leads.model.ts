import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type LeadsDocument = HydratedDocument<Leads>;

@Schema()
export class Leads {

    @Prop({
        type: String,
        required: true,
    })
    fullname: string;

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'contacts'
    })
    contact_id: Types.ObjectId[];

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
        enum: ['Nuevo', 'Activo', 'Cliente'],
        default: 'Nuevo'
    })
    status: string;

    @Prop({
        type: String,
        required: false,
        enum: ['Referencia', 'Sitio web', 'Redes sociales', 'LinkedIn', 'Otro']
    })
    origen: string;

    @Prop({
        type: String,
        required: true
    })
    relation: string;
}

export const LeadsSchema = SchemaFactory.createForClass(Leads);