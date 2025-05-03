import { API_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Elimina un horario
 * @param {string} id - ID del horario a eliminar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const deleteSchedule = async id => {
  try {
    console.log(`🗑️ Eliminando horario con ID: ${id}`);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include' // Enviar cookies con la petición
    });

    console.log(
      '📡 Estado de la respuesta:',
      response.status,
      response.statusText
    );

    return handleResponse(response);
  } catch (error) {
    console.error(`❌ Error al eliminar horario con ID ${id}:`, error);
    throw error;
  }
};
