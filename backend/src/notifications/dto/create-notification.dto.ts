import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { NotificationType } from '../notifications.constants';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  type: NotificationType;
  @IsMongoId()
  userId: string;
  metadata?: Record<string, any>;
  redirect_url?: string;
  read?: boolean = false;
}

export class TypedNotificationDto<T extends Record<string, any>> {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  metadata?: T;
  redirect_url?: string;
  read: boolean;
}
