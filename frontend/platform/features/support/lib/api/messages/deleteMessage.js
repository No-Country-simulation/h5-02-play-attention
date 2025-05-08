/**
 * Elimina un mensaje existente
 * @param {string} messageId - ID del mensaje a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
import { ENDPOINTS, getAuthHeaders } from '../../config/api';

export const deleteMessage = async messageId => {
  if (!messageId) throw new Error('ID de mensaje requerido');

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  const response = await fetch(`${ENDPOINTS.SUPPORT_MESSAGES}/${messageId}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar el mensaje');
  }

  return response.json();
};
