import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailTemplates, TemplateContextVariables } from './mail.types';
import { EmailTemplatesDefault, TECHNICAL_ERRORS } from './mail.constants';
import { FileValidatorService } from 'src/files/file-validator.service';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly emailLogger = new Logger('EmailModule');

  constructor(
    private mailerService: MailerService,
    private readonly fileValidator: FileValidatorService,
  ) {}

  async sendTemplateEmail<T extends EmailTemplates>(
    emailTemplate: T,
    emailAddress: string,
    contextVariables: TemplateContextVariables[T],
    from?: string,
  ) {
    const { templateName, defaultSubject } =
      EmailTemplatesDefault[emailTemplate];
    this.fileValidator.checkFileExists(
      join(__dirname, '/templates'),
      templateName,
      'hbs',
    );
    try {
      await this.mailerService.sendMail({
        to: emailAddress,
        subject: defaultSubject,
        template: templateName,
        context: contextVariables,
        ...(from ? { from } : {}),
      });
    } catch (error) {
      this.handleEmailError(error);
    }
  }

  private handleEmailError(error: Error) {
    if (this.isTechnicalError(error)) {
      this.emailLogger.error('Technical error sending email', error.stack);
      throw new InternalServerErrorException(
        'Failed to send email due to a server issue',
      );
    } else {
      this.emailLogger.error('Non-technical error', error.stack);
      throw new BadRequestException('Invalid email or request data');
    }
  }

  private isTechnicalError(error: Error): boolean {
    return TECHNICAL_ERRORS.some((code) => error.message.includes(code));
  }
}
