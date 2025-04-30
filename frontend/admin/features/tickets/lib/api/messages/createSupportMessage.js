/**
 * API para crear un nuevo mensaje de soporte
 * Implementa la operación POST a la API de mensajes
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Crea un nuevo mensaje de soporte
 * @param {Object} messageData - Datos del nuevo mensaje
 * @param {string} messageData.ticketId - ID del ticket al que pertenece el mensaje
 * @param {string} messageData.content - Contenido del mensaje
 * @param {string} messageData.userId - ID del usuario que creó el mensaje
 * @param {string} messageData.userType - Tipo de usuario (admin, user)
 * @returns {Promise<Object>} - El mensaje creado
 */
export async function createSupportMessage(messageData) {
  try {
    // Validar campos requeridos
    if (!messageData.ticketId) {
      throw new Error('El ID del ticket es obligatorio');
    }

    if (!messageData.content || messageData.content.trim() === '') {
      throw new Error('El contenido del mensaje es obligatorio');
    }

    // Realizar la petición
    const response = await fetch(`${API_URL}/support-messages`, {
      method: 'POST',
      headers: commonHeaders,
      credentials: 'include',
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const newMessage = await response.json();
    return newMessage;
  } catch (error) {
    console.error('Error al crear mensaje de soporte:', error);
    throw new Error(`Error al crear mensaje: ${error.message}`);
  }
}
