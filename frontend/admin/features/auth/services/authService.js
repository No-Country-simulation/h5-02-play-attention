/**
 * Servicios para la autenticación de usuarios
 */

/**
 * Realiza la autenticación del usuario
 * @param {Object} credentials - Credenciales del usuario
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} - Datos del usuario autenticado
 */
export const login = async credentials => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en el proceso de login');
  }

  return data;
};

/**
 * Cierra la sesión del usuario
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const logout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al cerrar sesión');
  }

  return data;
};

/**
 * Obtiene los datos del usuario actual
 * @returns {Promise<Object>} - Datos del usuario
 */
export const getUserProfile = async () => {
  const response = await fetch('/api/auth/session', {
    method: 'GET'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener perfil de usuario');
  }

  return data;
};
