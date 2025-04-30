import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"
import { Status, StatusType } from "../schema/schedule.schema"
import { IsString, IsMongoId, IsDateString, IsEnum, IsOptional } from "class-validator"

export class CreateScheduleDto {
    @ApiProperty({description:"El titulo de la cita",example:"Cita con el cliente"})
    @IsString({message:"El titulo es obligatorio"})
    title:string 

    @ApiProperty({description:"La descripcion de la cita",example:"Cita con el cliente para discutir el proyecto"})
    @IsString({message:"La descripcion es obligatoria"})
    description:string 

    @ApiProperty({description:"El id del lead",example:"666666666666666666666666"})
    @IsMongoId({message:"El id del lead es obligatorio"})
    lead:string

    @ApiProperty({description:"La hora de inicio de la cita",example:"2025-01-01T10:00:00.000Z"})
    @IsDateString({},{message:"La hora de inicio es obligatoria"})
    startTime: Date;

    @ApiProperty({description:"La hora de fin de la cita",example:"2025-01-01T11:00:00.000Z"})
    @IsDateString({},{message:"La hora de fin es obligatoria"})
    endTime: Date;

    @ApiProperty({description:"El estado de la cita",example:"Pending"})
    @IsEnum(Status,{message:"El estado es obligatorio"})
    status: StatusType;

    @ApiProperty({description:"El lugar de la cita",example:"Oficina"})
    @IsOptional()
    @IsString({message:"El lugar es obligatorio"})
    place?:string
}
