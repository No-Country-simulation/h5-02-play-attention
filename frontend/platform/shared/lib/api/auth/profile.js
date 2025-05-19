import { API_ENDPOINTS, fetchConfig } from '../config';

/**
 * Función para obtener el perfil del usuario autenticado
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Datos del perfil del usuario
 */
export const getProfile = async token => {
  const response = await fetch(API_ENDPOINTS.auth.profile, {
    method: 'GET',
    headers: {
      ...fetchConfig.defaultOptions.headers,
      ...fetchConfig.authHeaders(token)
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener perfil de usuario');
  }

  return data;
};
