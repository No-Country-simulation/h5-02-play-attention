import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import {
  UserForgotPasswordEvent,
  UserRegisteredEvent,
} from 'src/system-events/user.event';
import { USER_EVENTS } from 'src/system-events/event-names';
import { ConfigService } from '@nestjs/config';
import { UserRoleType } from 'src/users/schema/user.schema';

@Injectable()
export class AuthListener {
  private readonly logger = new Logger(AuthListener.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(USER_EVENTS.USER_REGISTERED)
  async handleUserCreated(event: UserRegisteredEvent) {
    const url = this.getUrl(event.role);

    try {
      await this.mailService.sendTemplateEmail('REGISTER_EMAIL', event.email, {
        fullname: event.fullname,
        password: event.password,
        email: event.email,
        url: url,
      });
    } catch (error) {
      this.logger.error(
        `Error al enviar email de registro a ${event.email}:`,
        error,
      );
    }
  }

  @OnEvent(USER_EVENTS.FORGOT_PASSWORD)
  async handleSendToken(event: UserForgotPasswordEvent) {
    const url = this.getUrl(event.role);

    try {
      await this.mailService.sendTemplateEmail('FORGOT_PASSWORD', event.email, {
        token: event.token,
        url,
      });
    } catch (error) {
      this.logger.error(
        `Error al enviar email con el token a ${event.email}:`,
        error,
      );
    }
  }

  private getUrl(role: UserRoleType) {
    return role === 'User'
      ? `${this.configService.get('frontend.platform_url')}/reset-password`
      : `${this.configService.get('frontend.crm_url')}/reset-password`;
  }
}
