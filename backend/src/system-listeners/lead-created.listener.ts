import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { LeadCreatedEvent } from 'src/system-events/lead-created.event';
import { LEAD_EVENTS } from 'src/system-events/event-names';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';

@Injectable()
export class LeadCreatedListener {
  private readonly logger = new Logger(LeadCreatedListener.name);

  constructor(
    private readonly mailService: MailService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationsService
  ) {}

  @OnEvent(LEAD_EVENTS.LEAD_CREATED)
  async handleLeadCreated(event: LeadCreatedEvent) {
    try {
      await this.mailService.sendTemplateEmail('WELCOME_TEMPLATE', event.email, {
        name: event.fullname,
      });

      const comercialUsers = await this.userService.findByRole('Comercial');
      
      if (comercialUsers && comercialUsers.length > 0) {
        const comercialUserEmails = comercialUsers.map(user => user.email);
        
        await this.mailService.sendPlainTextEmail(
          this.configService.get('MAIL_SYS_DEFAULT_DIR') || 'no-reply@email.com',
          'Nuevo Lead creado',
          'Un nuevo lead se ha creado, por favor tome las acciones adecuadas. Gracias',
          comercialUserEmails,
        );

     for (const comercial of comercialUsers) {
  const notificationDto: CreateNotificationDto = {
    title: 'Se ha generado un nuevo lead',
    message: `El cliente ${event.fullname} se ha registrado en la plataforma`,
    userId: comercial._id,
    leadId: event.leadId
  };

  // Crear y enviar una notificación separada por usuario
  await this.notificationService.createNotification(notificationDto);
}
       
      
      } else {
        this.logger.warn('No se encontraron usuarios comerciales para notificar');
      }
    } catch (error) {
      this.logger.error('Error en el manejo del evento de lead creado:', error);
    }
  }
}
