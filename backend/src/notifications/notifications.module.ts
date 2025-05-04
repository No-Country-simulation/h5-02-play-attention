import { forwardRef, Module } from "@nestjs/common";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationsService } from "./notifications.service";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema, Notification } from "./schema/notifications.schema";
import { UsersModule } from "../users/users.module";
import { NotificationsController } from "./notifications.controller";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('jwt.secret'),
                signOptions: { 
                    expiresIn: '1d' 
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        {
            provide: NotificationsGateway,
            useClass: NotificationsGateway
        },
        {
            provide: NotificationsService,
            useClass: NotificationsService
        }

    ],
    controllers: [NotificationsController],
    exports: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
