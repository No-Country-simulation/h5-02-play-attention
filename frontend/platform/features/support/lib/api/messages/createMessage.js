/**
 * Crea un nuevo mensaje en un ticket
 * @param {Object} messageData - Datos del mensaje
 * @param {string} messageData.ticketId - ID del ticket
 * @param {string} messageData.content - Contenido del mensaje
 * @returns {Promise<Object>} Mensaje creado
 */
import { ENDPOINTS, getAuthHeaders } from '../../config/api';
import { getUserInfoFromCookie } from '../../utils/cookies';

export const createMessage = async messageData => {
  if (!messageData.ticketId || !messageData.content) {
    throw new Error('ID de ticket y contenido son requeridos');
  }

  // Obtener información del usuario actual de las cookies
  const currentUser = getUserInfoFromCookie();
  if (!currentUser || !currentUser.id) {
    throw new Error('Usuario no autenticado');
  }

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  // Preparar los datos para enviar según el formato esperado por la API
  // Según la documentación y el error, necesitamos user_id y text
  const payload = {
    user_id: currentUser.id, // ID de MongoDB del usuario
    text: messageData.content, // Usar text en lugar de content
    ticket_id: messageData.ticketId // ID del ticket
  };

  console.log('Enviando mensaje:', payload);

  const response = await fetch(ENDPOINTS.SUPPORT_MESSAGES, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error completo del servidor:', error);
    throw new Error(error.message || 'Error al crear el mensaje');
  }

  return response.json();
};
