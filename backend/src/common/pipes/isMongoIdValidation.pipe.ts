import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`El id '${value}' no es un MongoID válido`);
    }
    return value;
  }
}
