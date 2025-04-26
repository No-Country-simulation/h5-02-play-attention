import { IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";
export class CreateTokenDto {

    @IsMongoId()
    user:Types.ObjectId;

    @IsString()
    token:string;
}
