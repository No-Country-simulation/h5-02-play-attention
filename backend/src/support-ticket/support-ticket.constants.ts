import { ResponseSupportTicketDto } from './dto/response-ticket.dto';

export const TICKET_STATUSES = [
  'open',
  'review',
  'progress',
  'pending_user',
  'pending_team',
  'resolved',
  'closed',
  'reopened',
] as const;

export const TICKET_CATEGORY = [
  'bug',
  'feature_request',
  'billing',
  'technical',
] as const;

export const TICKET_PRIORITY = ['low', 'medium', 'high', 'critical'] as const;

export const TICKET_ORIGIN = ['crm', 'user_plataform', 'wxternal'] as const;

export const TICKET_SORTABLE_FIELDS: (keyof ResponseSupportTicketDto)[] = [
  'created_at',
  'updated_at',
  'priority',
  'status',
  'title',
];

export type TicketStatuses = (typeof TICKET_STATUSES)[number];

export type TicketPriority = (typeof TICKET_PRIORITY)[number];

export type TicketCategory = (typeof TICKET_CATEGORY)[number];

export type TicketOrigin = (typeof TICKET_ORIGIN)[number];
