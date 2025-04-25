import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { UserRegisteredEvent } from 'src/system-events/user.event';
import { USER_EVENTS} from 'src/system-events/event-names';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserListener {
  private readonly logger = new Logger(UserListener.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService) {}

  @OnEvent(USER_EVENTS.USER_CREATED)
  async handleUserCreated(event: UserRegisteredEvent) {
    const url = this.configService.get('FRONTEND_URL') || "https://playatenttion-platform.vercel.app/";
    
    try {
      await this.mailService.sendTemplateEmail('REGISTER_EMAIL', event.email, {
        password: event.password,
        email: event.email,
        url
      });
      this.logger.log(`Email de registro enviado a ${event.email}`);
    } catch (error) {
      this.logger.error(`Error al enviar email de registro a ${event.email}:`, error);
    }
  }
}
