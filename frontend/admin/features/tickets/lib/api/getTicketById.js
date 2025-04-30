/**
 * Servicio para obtener un mensaje de soporte específico por ID
 * Sigue el principio SRP al encargarse únicamente de obtener un ticket
 */

import { API_URL, commonHeaders, handleResponseError } from './config';

/**
 * Obtiene un ticket de soporte por su ID
 * @param {string} id - ID del ticket a obtener
 * @returns {Promise<Object>} Ticket de soporte
 */
export async function getTicketById(id) {
  if (!id) {
    throw new Error('Se requiere ID para obtener el ticket');
  }

  try {
    const response = await fetch(`${API_URL}/support-messages/${id}`, {
      method: 'GET',
      headers: commonHeaders,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log('Ticket obtenido de API:', data);
    return data;
  } catch (error) {
    console.error(`Error fetching ticket with id ${id}:`, error);
    throw error;
  }
}
