import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { EmailTemplates } from './mail.types';
import { EmailTemplatesDefault } from './mail.constants';
import { FileValidatorService } from '../files/file-validator.service';

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;
  let fileValidatorService: FileValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        },
        FileValidatorService,
      ],
      imports: [],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
    fileValidatorService =
      module.get<FileValidatorService>(FileValidatorService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  it('should send an email with correct parameters', async () => {
    const email = 'test@example.com';
    const template = 'CONFIRM_EMAIL';
    const context = { name: 'sda', url: 'sdasd' };

    await mailService.sendTemplateEmail(template, email, context);
    jest.spyOn(fileValidatorService, 'checkFileExists').mockReturnValue(true);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: email,
      template: EmailTemplatesDefault[template].templateName,
      subject: EmailTemplatesDefault[template].defaultSubject,
      context: context,
      bcc: []
    });
  });

  it('testMissingTemplateHandling', async () => {
    const templateKey: EmailTemplates = 'CONFIRM_EMAIL';
    jest.spyOn(fileValidatorService, 'checkFileExists').mockReturnValue(false);
    try {
      await mailService.sendTemplateEmail(templateKey, 'a@b.com', {
        name: '',
        url: '',
      });
      fail('Expected sendTemplateEmail to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain(
        'Failed to send email due to a server issue',
      );
    }
  });
});
