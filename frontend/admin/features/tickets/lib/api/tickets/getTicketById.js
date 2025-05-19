/**
 * API para obtener un ticket específico por ID
 * Implementa la consulta GET a la API de tickets con ID
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Obtiene un ticket de soporte específico por su ID
 * @param {string} ticketId - ID del ticket a obtener
 * @returns {Promise<Object>} - El ticket solicitado
 */
export async function getTicketById(ticketId) {
  if (!ticketId) {
    throw new Error('ID de ticket no proporcionado');
  }

  try {
    const url = `${API_URL}/support-tickets/${ticketId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const ticket = await response.json();

    return ticket;
  } catch (error) {
    console.error(`Error al obtener ticket con ID ${ticketId}:`, error);
    throw new Error(`Error al obtener ticket: ${error.message}`);
  }
}
