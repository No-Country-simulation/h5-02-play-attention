import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Notification, NotificationDocument } from "./schema/notifications.schema";
import { Model, Types } from "mongoose";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationsGateway } from "./notifications.gateway";
import { UsersService } from "../users/users.service";

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,
        @Inject(forwardRef(() => NotificationsGateway))
        private readonly notificationsGateway: NotificationsGateway
    ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    try {
        this.logger.log('Creando notificación:', createNotificationDto);
        
        const notification = new this.notificationModel(createNotificationDto);
        await notification.save();


        await this.notificationsGateway.sendToUser(
            createNotificationDto.userId.toString(),
            'newNotification',
             notification 
        );

        return notification;
    } catch (error) {
        this.logger.error('Error al crear la notificación:', error);
        throw error;
    }   
}

    async notificationView(notificationId: string) {
        try {
            const notification = await this.notificationModel.findByIdAndUpdate(
                notificationId,
                { view: true },
                { new: true }   
            );
            this.logger.debug(`Notificación ${notificationId} marcada como vista`);
            return notification;
        } catch (error) {
            this.logger.error(`Error al marcar notificación ${notificationId} como vista:`, error);
            throw error;
        }
    }

    async getNotifications(id: string) {
     
        try {
            const userId=new Types.ObjectId(id);
            const notifications = await this.notificationModel.find({userId:userId}).sort({createdAt:-1});
            return notifications;
        } catch (error) {
            this.logger.error(`Error al obtener notificaciones para el usuario ${id}:`, error);
            throw error;
        }
    }
    async getNotificationById(notificationId: string) {
        try {
            const notification = await this.notificationModel.findById(notificationId);
            return notification;
        } catch (error) {
            this.logger.error(`Error al obtener notificación ${notificationId}:`, error);   
            throw error;
        }
    }

    async deleteNotification(notificationId: string) {
        try {
            await this.notificationModel.findByIdAndDelete(notificationId);
            this.logger.debug(`Notificación ${notificationId} eliminada`);
        } catch (error) {
            this.logger.error(`Error al eliminar notificación ${notificationId}:`, error);  
            throw error;
        }
    }
}
