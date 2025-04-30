/**
 * API para eliminar un mensaje de soporte
 * Implementa la operación DELETE a la API de mensajes
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Elimina un mensaje de soporte por su ID
 * @param {string} messageId - ID del mensaje a eliminar
 * @returns {Promise<boolean>} - Promesa resuelta si se elimina correctamente
 */
export async function deleteSupportMessage(messageId) {
  if (!messageId) {
    throw new Error('ID de mensaje no proporcionado');
  }

  try {
    const response = await fetch(`${API_URL}/support-messages/${messageId}`, {
      method: 'DELETE',
      headers: commonHeaders,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    return true; // Devolver true si se elimina correctamente
  } catch (error) {
    console.error(`Error al eliminar mensaje ${messageId}:`, error);
    throw new Error(`Error al eliminar mensaje: ${error.message}`);
  }
}
