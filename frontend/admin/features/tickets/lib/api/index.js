/**
 * Archivo de barril (index) para APIs de tickets de soporte
 * Centraliza todas las exportaciones para facilitar la importación en componentes
 */

// Importar tickets API
import { getTickets } from './tickets/getTickets';
import { getTicketById } from './tickets/getTicketById';
import { createTicket } from './tickets/createTicket';
import { updateTicket } from './tickets/updateTicket';
import { deleteTicket } from './tickets/deleteTicket';

// Importar mensajes API
import { getSupportMessages } from './messages/getSupportMessages';
import { getSupportMessageById } from './messages/getSupportMessageById';
import { createSupportMessage } from './messages/createSupportMessage';
import { updateSupportMessage } from './messages/updateSupportMessage';
import { deleteSupportMessage } from './messages/deleteSupportMessage';

// API de tickets
export const ticketsApi = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
};

// API de mensajes de soporte
export const messagesApi = {
  getSupportMessages,
  getSupportMessageById,
  createSupportMessage,
  updateSupportMessage,
  deleteSupportMessage
};

// Exportaciones individuales
export {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getSupportMessages,
  getSupportMessageById,
  createSupportMessage,
  updateSupportMessage,
  deleteSupportMessage
};
