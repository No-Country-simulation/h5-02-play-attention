/**
 * API para actualizar un ticket de soporte existente
 * Implementa la operación PUT a la API de tickets
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToBackend,
  mapTicketPriority,
  handleResponseError
} from '../config';

/**
 * Actualiza un ticket de soporte existente
 * @param {string} ticketId - ID del ticket a actualizar
 * @param {Object} ticketData - Datos actualizados del ticket
 * @param {string} ticketData.title - Título actualizado del ticket
 * @param {string} ticketData.description - Descripción actualizada del ticket
 * @param {string} ticketData.status - Estado actualizado del ticket
 * @param {string} ticketData.priority - Prioridad actualizada del ticket
 * @returns {Promise<Object>} - El ticket actualizado
 */
export async function updateTicket(ticketId, ticketData) {
  if (!ticketId) {
    throw new Error('ID de ticket no proporcionado');
  }

  try {
    // Preparar datos para el backend
    const mappedData = { ...ticketData };

    // Mapear el estado si existe
    if (ticketData.status) {
      mappedData.status = mapTicketStatusToBackend(ticketData.status);
    }

    // Mapear la prioridad si existe
    if (ticketData.priority) {
      mappedData.priority = mapTicketPriority(ticketData.priority);
    }

    // Realizar la petición
    const response = await fetch(`${API_URL}/support-tickets/${ticketId}`, {
      method: 'PUT',
      headers: commonHeaders,
      credentials: 'include',
      body: JSON.stringify(mappedData)
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const updatedTicket = await response.json();
    return updatedTicket;
  } catch (error) {
    console.error(`Error al actualizar ticket ${ticketId}:`, error);
    throw new Error(`Error al actualizar ticket: ${error.message}`);
  }
}
