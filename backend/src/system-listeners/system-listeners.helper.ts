import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { UserRoleType } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SystemListenerHelper {
  constructor(private readonly _userService: UsersService) {}

  async generateNotifications(
    role: UserRoleType,
    notificationData: CreateNotificationDto,
  ) {
    const comercialUsers = await this._userService.findByRole(role);

    const { notifications, emails } = comercialUsers.reduce(
      (acc, user) => {
        acc.notifications.push({ ...notificationData, userId: user.id });
        acc.emails.push(user.email);
        return acc;
      },
      { notifications: [] as CreateNotificationDto[], emails: [] as string[] },
    );
    return { notifications, emails };
  }
}
