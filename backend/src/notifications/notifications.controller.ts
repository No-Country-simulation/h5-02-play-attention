import { Controller, Get, Logger, Param, Query, Req, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { AuthGuard } from "../auth/auth.guard";


interface RequestWithUser extends Request {
  user: string;
}
@Controller("api/notifications")
export class NotificationsController {
    private readonly logger = new Logger(NotificationsController.name);
    constructor(private readonly notificationsService: NotificationsService) {}

    @UseGuards(AuthGuard)
    @Get()
    getNotifications(@Req() req: RequestWithUser) {

        return this.notificationsService.getNotifications(req.user);
    }

    @Get(":id")
    getNotificationById(@Param("id") id: string) {
        return this.notificationsService.getNotificationById(id);
    }
}
