import * as fs from 'fs';
import { FileValidatorService } from './file-validator.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileValidatorService', () => {
  let fileValidatorService: FileValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileValidatorService],
    }).compile();
    fileValidatorService =
      module.get<FileValidatorService>(FileValidatorService);
  });

  it('testErrorMessageFormat', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileName = 'testFile';
    const filePath = '/foo/bar';
    const extension = 'txt';

    expect(() => {
      fileValidatorService.checkFileExistsOrThrow(
        filePath,
        fileName,
        extension,
      );
    }).toThrow(`File not found: ${fileName}.${extension}`);
  });

  it('testErrorWithEmptyFileName', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileName = '';
    const filePath = '/foo/bar';
    const extension = 'txt';

    expect(() => {
      fileValidatorService.checkFileExistsOrThrow(
        filePath,
        fileName,
        extension,
      );
    }).toThrow(`File name and filePath are required`);
  });

  it('testErrorWithEmptyFileNameAndExtension', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const fileName = '';
    const filePath = '/foo/bar';
    const extension = '';

    expect(() => {
      fileValidatorService.checkFileExistsOrThrow(
        filePath,
        fileName,
        extension,
      );
    }).toThrow(`File name and filePath are required`);
  });

  it('testErrorWithSpecialCharactersInFileExtension', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileName = 'test@File#';
    const filePath = '/foo/bar';
    const extension = 't!xt';

    expect(() => {
      fileValidatorService.checkFileExistsOrThrow(
        filePath,
        fileName,
        extension,
      );
    }).toThrow(`Bad file extension`);
  });
});
