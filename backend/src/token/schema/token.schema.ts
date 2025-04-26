import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TokenDocument = Token & Document;

@Schema({timestamps:true})
export class Token {

    @Prop({required:true,unique:true,index:true,type:String})
    token:string;

    @Prop({
        required: true,
        type: Date,
        default: () => new Date(Date.now() + 60 * 60 * 1000)
    })
    expiresAt: Date;

    @Prop({required:true,type:Types.ObjectId,ref:'User'})
    user:Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
