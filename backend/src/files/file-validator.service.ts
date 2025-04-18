import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileValidatorService {
  private readonly logger = new Logger(FileValidatorService.name);

  checkFileExists(
    filePath: string,
    fileName: string,
    extension: string = 'hbs',
  ): boolean {
    const fullPath = join(filePath, `${fileName}.${extension}`);
    this.validations(filePath, fileName, extension);

    if (!existsSync(fullPath)) {
      this.logger.error(`File not found: ${fullPath}`);
      return false;
    }
    return true;
  }

  checkFileExistsOrThrow(
    filePath: string,
    fileName: string,
    extension: string = 'hbs',
  ): void {
    if (!this.checkFileExists(filePath, fileName, extension)) {
      throw new Error(`File not found: ${fileName}.${extension}. ENOTFOUND`);
    }
  }

  private validations(filePath: string, fileName: string, extension: string) {
    const noSymbolsExtension = /^\.[a-zA-Z0-9]{1,10}$/;
    if (!filePath || !fileName) {
      this.logger.error(`File name and filePath are required`);
      throw new Error(`File name and filePath are required`);
    }
    if (!noSymbolsExtension.test(`.${extension}`)) {
      this.logger.error(`Bad file extension`);
      throw new Error(`Bad file extension`);
    }
  }
}
