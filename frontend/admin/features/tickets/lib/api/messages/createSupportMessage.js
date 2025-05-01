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
 * @param {string} [messageData.userId] - ID del usuario que creó el mensaje (opcional, se puede obtener del servidor)
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

    // Validar que el ID de usuario sea válido (MongoDB ID, 24 caracteres hexadecimales)
    if (!messageData.userId) {
      throw new Error(
        'Se requiere un ID de usuario válido para crear mensajes'
      );
    }

    // Validar formato del ID de MongoDB (24 caracteres hexadecimales)
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(messageData.userId);
    if (!isValidMongoId) {
      console.error(
        `[ERROR] ID de usuario inválido: ${messageData.userId} (debe ser un ID de MongoDB válido)`
      );
      throw new Error(
        'El ID de usuario debe tener formato válido de MongoDB (24 caracteres hexadecimales)'
      );
    }

    // Adaptar los nombres de los campos al formato esperado por la API
    const dataToSend = {
      ticket_id: messageData.ticketId,
      text: messageData.content, // Usamos text en lugar de content según el formato de la API
      user_type: messageData.userType || 'admin', // Enviamos user_type en lugar de userType para seguir el formato de la API
      user_id: messageData.userId // ID de MongoDB del usuario que crea el mensaje
    };

    console.log('[DEBUG] createSupportMessage - Enviando mensaje:', dataToSend);

    // Realizar la petición
    const response = await fetch(`${API_URL}/support-messages`, {
      method: 'POST',
      headers: commonHeaders,
      credentials: 'include', // Esto permite enviar cookies, para que el backend identifique al usuario
      body: JSON.stringify(dataToSend)
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const newMessage = await response.json();
    console.log(
      '[DEBUG] createSupportMessage - Respuesta recibida:',
      newMessage
    );
    return newMessage;
  } catch (error) {
    console.error(
      '[ERROR] createSupportMessage - Error al crear mensaje:',
      error
    );
    throw new Error(`Error al crear mensaje: ${error.message}`);
  }
}
