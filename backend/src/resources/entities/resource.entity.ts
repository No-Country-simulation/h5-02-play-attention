import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResourcesDocument = Resource & Document;

@Schema({ timestamps: true })
export class Resource {

    @Prop({ required: false, type: Types.ObjectId,ref:"Category" })
    category?: Types.ObjectId;

    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required:false, type: String })
    url?: string;

  
}


export const ResourceSchema = SchemaFactory.createForClass(Resource);