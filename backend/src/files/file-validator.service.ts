import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileValidatorService {
  private readonly logger = new Logger(FileValidatorService.name);

  checkFileExists(filePath: string, fileName: string, extension = 'hbs'): void {
    const fullPath = join(filePath, `${fileName}.${extension}`);
    this.logger.debug(`Checking file: ${fullPath}`);

    if (!existsSync(fullPath)) {
      this.logger.error(`File not found: ${fullPath}`);
      throw new Error(`File not found: ${fileName}.${extension}`);
    }
  }
}
