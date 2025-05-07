/**
 * Actualiza un mensaje existente
 * @param {string} messageId - ID del mensaje a actualizar
 * @param {Object} updateData - Datos a actualizar
 * @param {string} updateData.content - Nuevo contenido del mensaje
 * @returns {Promise<Object>} Mensaje actualizado
 */
import { ENDPOINTS, getAuthHeaders } from '../../config/api';

export const updateMessage = async (messageId, updateData) => {
  if (!messageId) throw new Error('ID de mensaje requerido');
  if (!updateData.content) throw new Error('Contenido del mensaje requerido');

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  const response = await fetch(`${ENDPOINTS.SUPPORT_MESSAGES}/${messageId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el mensaje');
  }

  return response.json();
};
