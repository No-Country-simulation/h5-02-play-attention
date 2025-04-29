/**
 * Archivo de barril (index) para APIs de tickets de soporte
 * Centraliza todas las exportaciones para facilitar la importación en componentes
 */

// Importar las funciones individuales
import { getTickets } from './getTickets';
import { getTicketById } from './getTicketById';
import { createTicket } from './createTicket';
import { updateTicket } from './updateTicket';
import { deleteTicket } from './deleteTicket';

// Mantener una estructura para compatibilidad con patrones existentes
export const ticketsApi = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
};

// También exportar las funciones individuales para uso directo
export { getTickets, getTicketById, createTicket, updateTicket, deleteTicket };
