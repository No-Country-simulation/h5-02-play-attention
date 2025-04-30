/**
 * API para crear un nuevo ticket de soporte
 * Implementa la operación POST a la API de tickets
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToBackend,
  mapTicketPriority,
  handleResponseError
} from '../config';

/**
 * Crea un nuevo ticket de soporte
 * @param {Object} ticketData - Datos del nuevo ticket
 * @param {string} ticketData.title - Título del ticket
 * @param {string} ticketData.description - Descripción detallada del problema
 * @param {string} ticketData.status - Estado del ticket (abierto, en proceso, etc.)
 * @param {string} ticketData.priority - Prioridad del ticket (alta, media, baja)
 * @param {string} ticketData.userId - ID del usuario que creó el ticket
 * @returns {Promise<Object>} - El ticket creado
 */
export async function createTicket(ticketData) {
  try {
    // Validar campos requeridos
    if (!ticketData.title) {
      throw new Error('El título del ticket es obligatorio');
    }

    if (!ticketData.description) {
      throw new Error('La descripción del ticket es obligatoria');
    }

    // Preparar datos para el backend
    const mappedData = {
      ...ticketData,
      status: ticketData.status
        ? mapTicketStatusToBackend(ticketData.status)
        : 'open',
      priority: ticketData.priority
        ? mapTicketPriority(ticketData.priority)
        : 'medium'
    };

    // Realizar la petición
    const response = await fetch(`${API_URL}/support-tickets`, {
      method: 'POST',
      headers: commonHeaders,
      credentials: 'include',
      body: JSON.stringify(mappedData)
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const newTicket = await response.json();
    return newTicket;
  } catch (error) {
    console.error('Error al crear ticket:', error);
    throw new Error(`Error al crear ticket: ${error.message}`);
  }
}
