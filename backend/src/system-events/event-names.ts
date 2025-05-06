export const LEAD_EVENTS = {
  LEAD_CREATED: 'lead.created',
} as const;

export const USER_EVENTS = {
  USER_CREATED: 'user.created',
  USER_REGISTERED: 'user.created',
  FORGOT_PASSWORD: 'user.forgotPassword',
  USER_NEW_SEND_CREDENTIALS: 'user.new-send-credentials',
} as const;

export const NOTIFICATIONS = {
  CREATE_SINGLE: 'notifications.create-single',
  CREATE_MANY: 'notifications.create-many',
  EMAIL_PLAIN_SEND_MANY: 'notifications.email.plain-send-many',
  WS_SEND_MANY: 'notifications.ws.send-many',
} as const;

export const SUP_TICKETS = {
  USER_CREATED: 'sup-tickets.user-created',
};
