import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import {
  UserForgotPasswordEvent,
  UserRegisteredEvent,
} from 'src/system-events/user.event';
import { USER_EVENTS } from 'src/system-events/event-names';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserListener {
  private readonly logger = new Logger(UserListener.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(USER_EVENTS.USER_CREATED)
  async handleUserCreated(event: UserRegisteredEvent) {
    const url = event.role=== "User" ?
      `${this.configService.get('frontend.platform_url')}` : 
      `${this.configService.get('frontend.crm_url')}`;
    

    try {
      await this.mailService.sendTemplateEmail('REGISTER_EMAIL', event.email, {
        fullname: event.fullname,
        password: event.password,
        email: event.email,
        url,
      });
      this.logger.log(`Email de registro enviado a ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Error al enviar email de registro a ${event.email}:`,
        error,
      );
    }
  }

  @OnEvent(USER_EVENTS.FORGOT_PASSWORD)
  async handleSendToken(event: UserForgotPasswordEvent) {
    const url = event.role=== "User" ?
      `${this.configService.get('frontend.platform_url')}/reset-password` : 
      `${this.configService.get('frontend.crm_url')}/reset-password`;

    try {
      await this.mailService.sendTemplateEmail('FORGOT_PASSWORD', event.email, {
        token: event.token,
        url,
      });
      this.logger.log(`Email con token enviado a ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Error al enviar email con el token a ${event.email}:`,
        error,
      );
    }
  }
}
