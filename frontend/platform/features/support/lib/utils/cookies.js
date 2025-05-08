/**
 * Obtiene la información del usuario desde las cookies
 * @returns {Object|null} Información del usuario o null
 */
export const getUserInfoFromCookie = () => {
  try {
    // Verificar si estamos en un entorno de navegador
    if (typeof document === 'undefined') {
      // En el servidor, retornar null o un valor por defecto para SSR
      return process.env.NODE_ENV === 'development'
        ? { id: '68125a24dec51d7e0b27a2db', name: 'Usuario de Prueba SSR' }
        : null;
    }

    // Posibles nombres de cookie para usuario
    const possibleCookieNames = [
      'user_info=',
      'userInfo=',
      'user=',
      'session='
    ];

    const cookies = document.cookie.split(';');

    // Buscar en diferentes formatos de cookie
    for (const cookieName of possibleCookieNames) {
      const userCookie = cookies.find(cookie =>
        cookie.trim().startsWith(cookieName)
      );

      if (userCookie) {
        const userInfoValue = userCookie.split('=')[1];
        if (userInfoValue) {
          try {
            return JSON.parse(decodeURIComponent(userInfoValue));
          } catch (e) {
            console.log(`Error al parsear cookie ${cookieName}:`, e);
            // Continuar con la siguiente cookie si hay error
          }
        }
      }
    }

    // Si no se encontró información en las cookies, intentamos con localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageUser =
        localStorage.getItem('user') ||
        localStorage.getItem('userInfo') ||
        localStorage.getItem('session');

      if (localStorageUser) {
        try {
          return JSON.parse(localStorageUser);
        } catch (e) {
          console.log('Error al parsear localStorage:', e);
        }
      }
    }

    // Finalmente, si estamos en desarrollo y no hay cookies, usamos un ID mock
    if (process.env.NODE_ENV === 'development') {
      console.log('Usando ID de usuario mock para desarrollo');
      return { id: '68125a24dec51d7e0b27a2db', name: 'Usuario de Prueba' };
    }

    return null;
  } catch (error) {
    console.error('Error al leer cookie de usuario:', error);

    // En caso de error, retornar un usuario mock en desarrollo
    if (process.env.NODE_ENV === 'development') {
      return { id: '68125a24dec51d7e0b27a2db', name: 'Usuario Mock' };
    }

    return null;
  }
};

/**
 * Obtiene el token de autenticación de las cookies
 * @returns {string|null} Token de autenticación o null
 */
export const getAuthTokenFromCookie = () => {
  try {
    // Verificar si estamos en un entorno de navegador
    if (typeof document === 'undefined') {
      // En el servidor, retornar null o un token de desarrollo para SSR
      return process.env.NODE_ENV === 'development'
        ? 'mock-token-for-ssr'
        : null;
    }

    // Posibles nombres de cookie para el token
    const possibleTokenNames = ['auth_token_user=', 'token=', 'authorization='];
    const cookies = document.cookie.split(';');

    // Buscar en diferentes formatos de cookie
    for (const tokenName of possibleTokenNames) {
      const tokenCookie = cookies.find(cookie =>
        cookie.trim().startsWith(tokenName)
      );

      if (tokenCookie) {
        const tokenValue = tokenCookie.split('=')[1];
        if (tokenValue) {
          return decodeURIComponent(tokenValue);
        }
      }
    }

    // Intentar obtener el token del localStorage como alternativa
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageToken =
        localStorage.getItem('auth_token_user') ||
        localStorage.getItem('token') ||
        localStorage.getItem('authorization');

      if (localStorageToken) {
        return localStorageToken;
      }
    }

    console.warn('No se pudo encontrar el token de autenticación');
    return null;
  } catch (error) {
    console.error('Error al obtener token de autenticación:', error);
    return null;
  }
};
