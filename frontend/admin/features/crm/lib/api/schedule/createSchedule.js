import { API_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Crea un nuevo horario
 * @param {Object} scheduleData - Datos del horario a crear
 * @returns {Promise<Object>} Horario creado
 */
export const createSchedule = async scheduleData => {
  try {
    console.log('📝 Creando nuevo horario:', scheduleData);

    const response = await fetch(API_URL, {
      method: 'POST',
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
    console.error('❌ Error al crear horario:', error);
    throw error;
  }
};
