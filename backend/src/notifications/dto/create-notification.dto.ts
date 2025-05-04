import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsMongoId()
    @IsNotEmpty()
    leadId: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    userId: Types.ObjectId;
} 