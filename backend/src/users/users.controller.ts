import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-user.dto';
import { MongoIdValidationPipe } from '../common/pipes/isMongoIdValidation.pipe';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: QueryUsersDto) {
    const pageNumber = query.page ? Number(query.page) : 1;
    const limitNumber = query.limit ? Number(query.limit) : 10;
    return this.usersService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.usersService.remove(id);
  }
}
