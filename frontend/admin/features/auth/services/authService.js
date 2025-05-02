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
    // Proporcionar mensajes de error más amigables basados en el código de estado
    if (response.status === 401) {
      throw new Error(
        data.error || 'El email o la contraseña son incorrectos.'
      );
    } else if (response.status === 400) {
      throw new Error(
        data.error || 'Por favor, completa todos los campos correctamente.'
      );
    } else if (response.status === 404) {
      throw new Error(
        'El usuario no existe. Verifica tu email e intenta nuevamente.'
      );
    } else if (response.status === 403) {
      throw new Error('No tienes permisos para acceder a esta aplicación.');
    } else {
      throw new Error(
        data.error ||
          'Ha ocurrido un error al iniciar sesión. Por favor, intenta nuevamente.'
      );
    }
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
