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
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    // Manejar errores de red o respuesta no válida
    if (!response) {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Error al parsear respuesta de login:', parseError);
      throw new Error(
        'Ocurrió un error al procesar la respuesta del servidor. Por favor, intenta nuevamente.'
      );
    }

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
  } catch (error) {
    // Capturar errores generales para mejorar la experiencia del usuario
    console.error('Error en el proceso de login:', error);
    if (
      error.name === 'TypeError' &&
      error.message.includes('Failed to fetch')
    ) {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      );
    }
    // Propagar el error ya formateado o generar uno genérico
    throw error.message
      ? error
      : new Error('Error desconocido durante el inicio de sesión.');
  }
};

/**
 * Cierra la sesión del usuario
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const logout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Error al parsear respuesta de logout:', parseError);
      throw new Error(
        'Ocurrió un error al procesar la respuesta del servidor. La sesión se cerrará de todos modos.'
      );
    }

    if (!response.ok) {
      throw new Error(data.error || 'Error al cerrar sesión');
    }

    return data;
  } catch (error) {
    console.error('Error en el proceso de logout:', error);
    // Para logout, incluso en caso de error queremos cerrar sesión localmente
    throw new Error(
      'Error al cerrar sesión en el servidor. La sesión se cerrará localmente.'
    );
  }
};

/**
 * Obtiene los datos del usuario actual
 * @returns {Promise<Object>} - Datos del usuario
 */
export const getUserProfile = async () => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET'
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Error al parsear respuesta de sesión:', parseError);
      return { isAuthenticated: false, user: null };
    }

    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener perfil de usuario');
    }

    return data;
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    return { isAuthenticated: false, user: null };
  }
};
