import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  EmailTemplateMap,
  EmailTemplatesT,
  TemplateContextVariables,
} from './mail.types';

const EmailTemplatesDefault: EmailTemplateMap = {
  CONFIRM_EMAIL: {
    relativePath: 'confirmEmail',
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

@Injectable()
export class MailService {
  private readonly emailLogger = new Logger('EmailModule');

  constructor(private mailerService: MailerService) {}

  async sendEmail<T extends EmailTemplatesT>(
    emailTemplate: T,
    emailAddress: string,
    contextVariables: TemplateContextVariables[T],
    from?: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: emailAddress,
        subject: EmailTemplatesDefault[emailTemplate].defaultSubject,
        template: EmailTemplatesDefault[emailTemplate].relativePath,
        context: contextVariables,
        ...(from ? { from } : {}),
      });
    } catch (error) {
      if (this.isTechnicalError(error)) {
        this.emailLogger.error(`Technical error sending email`, error.stack);
        throw new InternalServerErrorException(
          'Failed to send email due to a server issue',
        );
      } else {
        this.emailLogger.error(`An error occurred`, error.stack);
        throw new BadRequestException(
          'An error occurred. Please verify the email or contact the system administrator',
        );
      }
    }
  }

  private isTechnicalError(error: Error): boolean {
    const technicalErrors = ['ECONNREFUSED', 'ENOTFOUND', 'EAUTH'];
    return technicalErrors.some((code) => error.message.includes(code));
  }
}
