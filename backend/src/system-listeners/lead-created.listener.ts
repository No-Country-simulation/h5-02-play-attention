import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { LeadCreatedEvent } from 'src/system-events/lead-created.event';
import { LEAD_EVENTS } from 'src/system-events/event-names';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LeadCreatedListener {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(LEAD_EVENTS.LEAD_CREATED)
  handleLeadCreated(event: LeadCreatedEvent) {
    this.mailService.sendTemplateEmail('WELCOME_TEMPLATE', event.email, {
      name: event.fullname,
    });

    this.userService
      .findByRole('Comercial')
      .then((data) => {
        const comercialUserEmails = data.map((user) => user.email);
        this.mailService.sendPlainTextEmail(
          this.configService.get('MAIL_SYS_DEFAULT_DIR') ||
            'no-reply@email.com',
          'Nuevo Lead creado',
          'Un nuevo lead se ha creado, por favor tome las acciones adecuadas. Gracias',
          comercialUserEmails,
        );
      })
      .catch((err) => console.log(err));
  }
}
