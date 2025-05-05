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
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        data.message || 'El email o la contraseña son incorrectos.'
      );
    } else if (response.status === 404) {
      throw new Error(
        data.message ||
          'El usuario no existe. Verifica tu email e intenta nuevamente.'
      );
    } else if (response.status === 400) {
      throw new Error(
        data.message || 'Por favor, completa todos los campos correctamente.'
      );
    } else {
      throw new Error(
        data.message ||
          'Ha ocurrido un error al iniciar sesión. Por favor, intenta nuevamente.'
      );
    }
  }

  // Manejar formato de token variable (puede venir como token o playAttentionToken)
  if (data.playAttentionToken && !data.token) {
    data.token = data.playAttentionToken;
  }

  return data;
};
