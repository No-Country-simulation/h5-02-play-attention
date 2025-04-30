/**
 * API para eliminar un ticket de soporte
 * Implementa la operación DELETE a la API de tickets
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Elimina un ticket de soporte por su ID
 * @param {string} ticketId - ID del ticket a eliminar
 * @returns {Promise<void>} - Promesa resuelta si se elimina correctamente
 */
export async function deleteTicket(ticketId) {
  if (!ticketId) {
    throw new Error('ID de ticket no proporcionado');
  }

  try {
    const response = await fetch(`${API_URL}/support-tickets/${ticketId}`, {
      method: 'DELETE',
      headers: commonHeaders,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    return true; // Devolver true si se elimina correctamente
  } catch (error) {
    console.error(`Error al eliminar ticket ${ticketId}:`, error);
    throw new Error(`Error al eliminar ticket: ${error.message}`);
  }
}
