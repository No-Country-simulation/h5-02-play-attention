import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { getMailConfig } from './mail.config';
import { FilesModule } from 'src/files/files.module';

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [
    MailerModule.forRootAsync({
      useFactory: getMailConfig,
      inject: [ConfigService],
    }),
    FilesModule,
  ],
  exports: [MailService],
})
export class MailModule {}
