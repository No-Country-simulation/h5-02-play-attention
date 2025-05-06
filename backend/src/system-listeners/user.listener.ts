import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { UserRegisteredEvent } from 'src/system-events/user.event';
import { NOTIFICATIONS, USER_EVENTS } from 'src/system-events/event-names';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { SystemListenerHelper } from './system-listeners.helper';

@Injectable()
export class UserListener {
  private readonly logger = new Logger(UserListener.name);

  constructor(
    private readonly _eventEmitter: EventEmitter2,
    private readonly _helper: SystemListenerHelper,
  ) {}

  @OnEvent(USER_EVENTS.USER_REGISTERED)
  async handleUserCreated(event: UserRegisteredEvent) {
    const notification = {
      message: `Nuevo usuario registrado ${event.fullname} como ${event.role}`,
      title: 'Nuevo usuario registrado',
      type: 'Info',
      userId: '',
    } as CreateNotificationDto;
    try {
      const { notifications } = await this._helper.generateNotifications(
        'Admin',
        notification,
      );
      this._eventEmitter.emit(NOTIFICATIONS.CREATE_MANY, notifications);
      this._eventEmitter.emit(NOTIFICATIONS.WS_SEND_MANY, notifications);
    } catch (error) {
      this.logger.error(
        `Error al enviar email de registro a ${event.email}:`,
        error,
      );
    }
  }
}
