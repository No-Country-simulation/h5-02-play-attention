import { forwardRef, Module } from "@nestjs/common";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationsService } from "./notifications.service";
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema, Notification } from "./schema/notifications.schema";
import { UsersModule } from "../users/users.module";
import { NotificationsController } from "./notifications.controller";
import { NotificationsEventHandler } from "./notifications.listener";
import { MailModule } from "src/mail/mail.module";
import { WsGuard } from "src/auth/ws.guard";
import { TokenModule } from "src/token/token.module";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        ConfigModule,
        TokenModule,
        MailModule,
    ],
    providers: [
        NotificationsGateway,
        NotificationsService,
        NotificationsEventHandler,
        WsGuard,
    ],
    controllers: [NotificationsController],
    exports: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
