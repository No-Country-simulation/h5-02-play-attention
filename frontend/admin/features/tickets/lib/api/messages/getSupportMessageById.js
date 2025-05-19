/**
 * API para obtener un mensaje de soporte específico por ID
 * Implementa la consulta GET a la API de mensajes con ID
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Obtiene un mensaje de soporte específico por su ID
 * @param {string} messageId - ID del mensaje a obtener
 * @returns {Promise<Object>} - El mensaje solicitado
 */
export async function getSupportMessageById(messageId) {
  if (!messageId) {
    throw new Error('ID de mensaje no proporcionado');
  }

  try {
    const url = `${API_URL}/support-messages/${messageId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const message = await response.json();

    return message;
  } catch (error) {
    console.error(`Error al obtener mensaje con ID ${messageId}:`, error);
    throw new Error(`Error al obtener mensaje: ${error.message}`);
  }
}
