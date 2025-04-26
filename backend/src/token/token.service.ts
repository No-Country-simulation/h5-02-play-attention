import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token } from './schema/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel:Model<Token>
  ){}
  async create(createTokenDto: CreateTokenDto) {
   const token=await this.tokenModel.create(createTokenDto)
    return token;
  }

  async findByToken(token:string){
    const tokenExists=await this.tokenModel.findOne({token})
    if(!tokenExists){
      throw new NotFoundException('No se encontro el token')
    }
    return tokenExists;
  }

}
