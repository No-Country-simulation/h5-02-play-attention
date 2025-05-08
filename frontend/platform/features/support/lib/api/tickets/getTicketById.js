/**
 * Obtiene un ticket por su ID
 * @param {string} ticketId - ID del ticket a obtener
 * @returns {Promise<Object>} Ticket con sus detalles
 */
import { ENDPOINTS, getAuthHeaders } from '../../config/api';

export const getTicketById = async ticketId => {
  if (!ticketId) throw new Error('ID de ticket requerido');

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  const response = await fetch(`${ENDPOINTS.SUPPORT_TICKETS}/${ticketId}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el ticket');
  }

  return response.json();
};
