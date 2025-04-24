import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type LeadsDocument = HydratedDocument<Leads>;

@Schema({
    timestamps: true
})
export class Leads {

    @Prop({
        type: String,
        required: true,
    })
    fullname: string;

     @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'engegements'
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
        enum: ['Profesional', 'Persona individual', 'Empresa']
    })
    service: string;

    @Prop({
        type: String,
        required: true,
    })
    notes: string;

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
        enum: ['Referencia', 'Sitio web', 'Redes sociales', 'LinkedIn', 'Otro'],
        default: 'Sitio Web'
    })
    origen: string;

    @Prop({
        type: String,
        required: true
    })
    relation: string;
}

export const LeadsSchema = SchemaFactory.createForClass(Leads);