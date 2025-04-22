import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type CategoriesDocument = HydratedDocument<Categories>;

@Schema()
export class Categories {

    @Prop({
        type: String,
        required: true
    })
    name: string;

    @Prop({
        type: String,
        required: true
    })
    description: string;

    @Prop({
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, // ✅ Tipo correcto
            ref: 'Resource' // Reemplaza 'Resource' por el nombre de tu modelo relacionado
        }],
        required: false
    })
    resources_id: Types.ObjectId[];
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);