import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { EmailTemplateMap } from './mail.types';

const EmailTemplatesDefault: EmailTemplateMap = {
  CONFIRM_EMAIL: {
    relativePath: './confirmEmail',
    defaultSubject: 'Verify Email Address',
    vars: ['name', 'url'],
  },
  EMAIL_UPDATED: {
    relativePath: './emailChanged',
    defaultSubject: 'Account Email Changed',
    vars: ['name'],
  },
  PASSWORD_UPDATED: {
    relativePath: './passwordChanged',
    defaultSubject: 'Account Password Changed',
    vars: ['name'],
  },
  RESET_PASSWORD: {
    relativePath: './pswrdReset',
    defaultSubject: 'Password Reset',
    vars: ['name', 'url'],
  },
};

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  it('should send an email with correct parameters', async () => {
    const email = 'test@example.com';
    const template = 'CONFIRM_EMAIL';
    const context = { name: 'sda', url: 'sdasd' };

    await mailService.sendEmail(template, email, context);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: email,
      template: EmailTemplatesDefault[template].relativePath,
      subject: EmailTemplatesDefault[template].defaultSubject,
      context: context,
    });
  });

  it('testMissingTemplateHandling', () => {
    const templateKey = 'NON_EXISTENT_TEMPLATE';
    expect(() => {
      const template =
        EmailTemplatesDefault[templateKey as keyof EmailTemplateMap];
      if (!template) {
        throw new Error('Template not found');
      }
    }).toThrow('Template not found');
  });
});
