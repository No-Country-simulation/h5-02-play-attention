/**
 * Servicio para eliminar un mensaje de soporte
 * Sigue el principio SRP al encargarse únicamente de eliminar un ticket
 */

import { API_URL, commonHeaders, handleResponseError } from './config';

/**
 * Elimina un ticket de soporte por su ID
 * @param {string} id - ID del ticket a eliminar
 * @returns {Promise<boolean>} Resultado de la operación
 */
export async function deleteTicket(id) {
  if (!id) {
    throw new Error('Se requiere ID para eliminar el ticket');
  }

  try {
    console.log(`Eliminando ticket con ID: ${id}`);

    const response = await fetch(`${API_URL}/support-messages/${id}`, {
      method: 'DELETE',
      headers: commonHeaders,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    console.log(`Ticket ${id} eliminado correctamente`);
    return true;
  } catch (error) {
    console.error(`Error deleting ticket with id ${id}:`, error);
    throw error;
  }
}
