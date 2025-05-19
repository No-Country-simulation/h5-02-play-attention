import { API_ENDPOINTS, fetchConfig } from '../config';

/**
 * Función para obtener los datos de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Datos del usuario
 */
export const getUserById = async (userId, token) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }

  const response = await fetch(API_ENDPOINTS.users.getById(userId), {
    method: 'GET',
    headers: {
      ...fetchConfig.defaultOptions.headers,
      ...fetchConfig.authHeaders(token)
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Error al obtener usuario con ID ${userId}`
    );
  }

  return data;
};
