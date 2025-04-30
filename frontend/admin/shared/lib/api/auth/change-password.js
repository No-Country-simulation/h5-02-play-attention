import { API_ENDPOINTS, fetchConfig } from '../config';

/**
 * Función para cambiar la contraseña del usuario
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const changePassword = async (currentPassword, newPassword, token) => {
  const response = await fetch(API_ENDPOINTS.auth.changePassword, {
    method: 'POST',
    headers: {
      ...fetchConfig.defaultOptions.headers,
      ...fetchConfig.authHeaders(token)
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al cambiar la contraseña');
  }

  return data;
};
