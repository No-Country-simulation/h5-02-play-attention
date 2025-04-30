/**
 * API para actualizar un mensaje de soporte existente
 * Implementa la operación PUT a la API de mensajes
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Actualiza un mensaje de soporte existente
 * @param {string} messageId - ID del mensaje a actualizar
 * @param {Object} messageData - Datos actualizados del mensaje
 * @param {string} messageData.content - Contenido actualizado del mensaje
 * @returns {Promise<Object>} - El mensaje actualizado
 */
export async function updateSupportMessage(messageId, messageData) {
  if (!messageId) {
    throw new Error('ID de mensaje no proporcionado');
  }

  try {
    // Validar campo requerido
    if (!messageData.content || messageData.content.trim() === '') {
      throw new Error('El contenido del mensaje es obligatorio');
    }

    // Realizar la petición
    const response = await fetch(`${API_URL}/support-messages/${messageId}`, {
      method: 'PUT',
      headers: commonHeaders,
      credentials: 'include',
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const updatedMessage = await response.json();
    return updatedMessage;
  } catch (error) {
    console.error(`Error al actualizar mensaje ${messageId}:`, error);
    throw new Error(`Error al actualizar mensaje: ${error.message}`);
  }
}
