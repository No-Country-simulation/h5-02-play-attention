export const NOTIFICATION_TYPE = [
  'Info',
  'Warning',
  'Success',
  'Error',
  'System',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[number];
