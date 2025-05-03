import { API_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Actualiza un horario existente
 * @param {string} id - ID del horario a actualizar
 * @param {Object} scheduleData - Datos actualizados del horario
 * @returns {Promise<Object>} Horario actualizado
 */
export const updateSchedule = async (id, scheduleData) => {
  try {
    console.log(`🔄 Actualizando horario con ID ${id}:`, scheduleData);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include', // Enviar cookies con la petición
      body: JSON.stringify(scheduleData)
    });

    console.log(
      '📡 Estado de la respuesta:',
      response.status,
      response.statusText
    );

    return handleResponse(response);
  } catch (error) {
    console.error(`❌ Error al actualizar horario con ID ${id}:`, error);
    throw error;
  }
};
