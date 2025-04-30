import { API_ENDPOINTS, fetchConfig } from '../config';

/**
 * Función para solicitar restauración de contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const forgotPassword = async email => {
  const response = await fetch(API_ENDPOINTS.auth.forgotPassword, {
    method: 'POST',
    headers: {
      ...fetchConfig.defaultOptions.headers
    },
    body: JSON.stringify({ email })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Error al solicitar restauración de contraseña'
    );
  }

  return data;
};
