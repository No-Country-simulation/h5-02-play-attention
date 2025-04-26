import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schema/token.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:Token.name,schema:TokenSchema}])], 
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
