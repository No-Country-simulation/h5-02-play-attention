import { API_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Obtiene todos los horarios
 * @returns {Promise<Array>} Lista de horarios
 */
export const getSchedules = async () => {
  try {
    console.log('🔍 Obteniendo horarios');
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('❌ Error al obtener horarios:', error);
    throw error;
  }
};
