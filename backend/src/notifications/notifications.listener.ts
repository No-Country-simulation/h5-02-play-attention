import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { MailService } from 'src/mail/mail.service';
import { NOTIFICATIONS } from '../system-events/event-names';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { EmailPlainToManyNotif } from '../system-events/notifications/notif-create.event.dto';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './schema/notifications.schema';

@Injectable()
export class NotificationsEventHandler {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly emailService: MailService,
    private readonly _wsGateway: NotificationsGateway,
  ) {}

  @OnEvent(NOTIFICATIONS.CREATE_SINGLE)
  async handleNotificationCreatedEvent(payload: CreateNotificationDto) {
    await this.notificationsService.createNotification(payload);
  }

  @OnEvent(NOTIFICATIONS.CREATE_MANY)
  async handleNotificationBulkCreateEvent(payload: CreateNotificationDto[]) {
    await this.notificationsService.bulkCreateNoOrder(payload);
  }

  @OnEvent(NOTIFICATIONS.EMAIL_PLAIN_SEND_MANY)
  handleSendEmailToAdmins(payload: EmailPlainToManyNotif) {
    this.emailService.sendPlainTextEmail(
      'a@xiriuxb.xyz',
      payload.subject,
      payload.message,
      payload.emails,
    );
  }

  @OnEvent(NOTIFICATIONS.WS_SEND_MANY)
  handleSendWsNotifications(payload: CreateNotificationDto[]) {
    for (const notif of payload) {
      this._wsGateway.sendToUser(
        notif.userId,
        'notification',
        notif as Notification,
      );
    }
  }
}
