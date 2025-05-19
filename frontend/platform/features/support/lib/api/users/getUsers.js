/**
 * Obtiene todos los usuarios del sistema
 * @param {Object} params - Parámetros de búsqueda (page, limit)
 * @returns {Promise<Object>} Lista de usuarios y metadata
 */
import { API_BASE_URL, getAuthHeaders } from '../../config/api';

export const getUsers = async (params = { limit: 100 }) => {
  // Construir query string con los parámetros
  const queryParams = new URLSearchParams();

  // Agregar parámetros si existen
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);

  // Endpoint de usuarios
  const url = `${API_BASE_URL}/users${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener usuarios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};
