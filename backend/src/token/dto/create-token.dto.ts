import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";
export class CreateTokenDto {
    @ApiProperty({description:"El id del usuario",example:"666666666666666666666666"})
    @IsMongoId()
    user:Types.ObjectId;

    @ApiProperty({description:"El token",example:"1234567890"})
    @IsString()
    token:string;
}
