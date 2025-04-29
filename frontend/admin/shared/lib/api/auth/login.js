import { API_ENDPOINTS, fetchConfig } from '../config';

/**
 * Función para iniciar sesión de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Datos del usuario autenticado y token
 */
export const login = async (email, password) => {
  const response = await fetch(API_ENDPOINTS.auth.login, {
    method: 'POST',
    headers: {
      ...fetchConfig.defaultOptions.headers
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  // Manejar formato de token variable (puede venir como token o playAttentionToken)
  if (data.playAttentionToken && !data.token) {
    data.token = data.playAttentionToken;
  }

  return data;
};
