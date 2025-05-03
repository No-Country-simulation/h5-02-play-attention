import { API_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Obtiene un horario por su ID
 * @param {string} id - ID del horario a obtener
 * @returns {Promise<Object>} Horario encontrado
 */
export const getScheduleById = async id => {
  try {
    console.log(`🔍 Obteniendo horario con ID: ${id}`);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
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
    console.error(`❌ Error al obtener horario con ID ${id}:`, error);
    throw error;
  }
};
