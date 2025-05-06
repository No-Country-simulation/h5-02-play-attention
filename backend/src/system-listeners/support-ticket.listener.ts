import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TypedNotificationDto } from '../notifications/dto/create-notification.dto';
import { EmailPlainToManyNotif } from 'src/system-events/notifications/notif-create.event.dto';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATIONS, SUP_TICKETS } from 'src/system-events/event-names';
import { SupportTickets } from 'src/support-ticket/schema/support-ticket.schema';
import { SystemListenerHelper } from './system-listeners.helper';

@Injectable()
export class SupportTicketListener {
  private readonly logger = new Logger(SupportTicketListener.name);

  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly _helper: SystemListenerHelper,
    private readonly emitter: EventEmitter2,
  ) {}

  @OnEvent(SUP_TICKETS.USER_CREATED)
  async handleUserCreated(event: SupportTickets) {
    const notificationData: TypedNotificationDto<{ id: string }> = {
      message: `Se ha generado un nuevo ticket en ${event.ticket_origin}, por ${event.user_id})`,
      title: 'Nuevo ticket de soporte generado',
      type: 'Info',
      userId: '',
      metadata: { id: event._id },
      read: false,
      redirect_url: `/crm/${event._id}`,
    };
    try {
      const { notifications, emails } =
        await this._helper.generateNotifications('Admin', notificationData);

      if (emails) {
        this.emitter.emit(NOTIFICATIONS.CREATE_MANY, notifications);

        this.emitter.emit(NOTIFICATIONS.EMAIL_PLAIN_SEND_MANY, {
          emails,
          message: notificationData.message,
          subject: notificationData.title,
        } as EmailPlainToManyNotif);

        this.emitter.emit(NOTIFICATIONS.WS_SEND_MANY, notifications);
      }
    } catch (error) {
      this.logger.error('Error en el manejo del evento de lead creado:', error);
    }
  }
}
