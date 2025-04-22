import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUsersDto } from './dto/query-user.dto';
import { MongoIdValidationPipe } from '../common/pipes/isMongoIdValidation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("users")
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados por página' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  findAll(@Query() query: QueryUsersDto) {
    const pageNumber = query.page ? Number(query.page) : 1;
    const limitNumber = query.limit ? Number(query.limit) : 10;
    return this.usersService.findAll(pageNumber, limitNumber);
  }

  @ApiOperation({summary:"Obtener usuario por id"})
  @ApiParam({name:"id",description:"Id del usuario a obtener",type:String})
  @ApiResponse({status:200,description:"Usuario encontrado exitosamente"})
  @ApiResponse({status:400,description:"Datos inválidos"})
  @Get(':id')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({summary:"Actualizar usuario por id"})
  @ApiParam({name:"id",description:"Id del usuario a actualizar",type:String})
  @ApiBody({type:UpdateUserDto})
  @ApiResponse({status:200,description:"Usuario actualizado exitosamente"})
  @ApiResponse({status:400,description:"Datos inválidos"})
  @Put(':id')
  update(
    @Param('id', MongoIdValidationPipe) id: string,
   @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({summary:"Eliminar usuario por id"})
  @ApiParam({name:"id",description:"Id del usuario a eliminar",type:String})
  @ApiResponse({status:200,description:"Usuario eliminado exitosamente"})
  @ApiResponse({status:400,description:"Datos inválidos"})
  @Delete(':id')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.usersService.remove(id);
  }
}
