import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { LeadCreatedEvent } from 'src/system-events/lead-created.event';
import { LEAD_EVENTS } from '../system-events/event-names';

@Injectable()
export class LeadsListener {
  private readonly logger = new Logger(LeadsListener.name);

  constructor(private readonly mailService: MailService) {}

  @OnEvent(LEAD_EVENTS.LEAD_CREATED)
  handleLeadCreated(event: LeadCreatedEvent) {
    this.mailService.sendTemplateEmail('WELCOME_TEMPLATE', event.email, {
      name: event.fullname,
    });
  }
}
