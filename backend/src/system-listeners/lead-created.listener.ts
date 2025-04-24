import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { LeadCreatedEvent } from 'src/system-events/lead-created.event';
import { LEAD_EVENTS } from 'src/system-events/event-names';

@Injectable()
export class LeadCreatedListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(LEAD_EVENTS.LEAD_CREATED)
  async handleLeadCreated(event: LeadCreatedEvent) {
    await this.mailService.sendTemplateEmail('WELCOME_TEMPLATE', event.email, {
      name: event.fullname,
    });
  }
}
