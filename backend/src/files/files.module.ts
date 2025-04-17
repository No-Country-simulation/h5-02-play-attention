import { Module } from '@nestjs/common';
import { FileValidatorService } from './file-validator.service';

@Module({
  providers: [FileValidatorService],
  exports: [FileValidatorService], // ¡Importante para usarlo en otros módulos!
})
export class FilesModule {}
