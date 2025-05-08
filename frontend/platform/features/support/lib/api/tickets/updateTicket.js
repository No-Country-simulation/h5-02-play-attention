/**
 * Actualiza un ticket existente
 * @param {string} ticketId - ID del ticket a actualizar
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<Object>} Ticket actualizado
 */
import { ENDPOINTS, getAuthHeaders } from '../../config/api';

export const updateTicket = async (ticketId, updateData) => {
  if (!ticketId) throw new Error('ID de ticket requerido');

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  const response = await fetch(`${ENDPOINTS.SUPPORT_TICKETS}/${ticketId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el ticket');
  }

  return response.json();
};
