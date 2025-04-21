import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailConfig: (...args: any[]) => Promise<MailerOptions> = async (
  configService: ConfigService,
) => ({
  transport: {
    host: configService.get('MAIL_HOST'),
    port: configService.get('MAIL_PORT'),
    connectionTimeout: 10000,
    secure: false,
    auth: {
      user: configService.get('MAIL_USERNAME'),
      pass: configService.get('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `"No Reply" <${configService.get('MAIL_FROM_ADDRESS')}>`,
  },
  // preview: {
  //   open: {
  //     app: 'firefox',
  //     wait: false,
  //   },
  // },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
