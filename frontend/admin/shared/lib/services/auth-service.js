import { login, changePassword, forgotPassword, getProfile } from '../api/auth';
import { getUserById } from '../api/users';
import { jwtDecode } from 'jwt-decode';

// Claves para el almacenamiento local
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Decodificar token JWT para obtener el ID del usuario
 * @param {string} token - JWT token
 * @returns {Object} Payload del token decodificado
 */
const decodeToken = token => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
};

/**
 * Establece una cookie con el token
 * @param {string} name - Nombre de la cookie
 * @param {string} value - Valor de la cookie
 * @param {number} days - Días de validez
 */
const setCookie = (name, value, days = 7) => {
  if (typeof window === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

/**
 * Servicio para gestionar la autenticación de usuarios
 */
export const AuthService = {
  /**
   * Iniciar sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario y token
   */
  async login(email, password) {
    // 1. Realizar la petición de login
    const loginResponse = await login(email, password);
    const { token } = loginResponse;

    if (!token) {
      console.error('Respuesta completa:', loginResponse);
      throw new Error('Token no recibido del servidor');
    }

    // 2. Decodificar el token para obtener el ID del usuario
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.user) {
      console.warn(
        'Token recibido pero no se pudo decodificar correctamente:',
        token
      );
      // Guardar solo el token si no se puede decodificar
      localStorage.setItem(TOKEN_KEY, token);
      // Guardar también como cookie para el middleware
      setCookie(TOKEN_KEY, token);

      // Si el token original viene como playAttentionToken, guardar también con ese nombre
      if (loginResponse.playAttentionToken) {
        setCookie('playAttentionToken', loginResponse.playAttentionToken);
      }

      // Si hay datos de usuario en la respuesta, usarlos directamente
      if (loginResponse.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(loginResponse.user));
        return {
          token,
          user: loginResponse.user
        };
      }

      return { token, user: { id: 'unknown', role: 'user' } };
    }

    const userId = decodedToken.user;

    try {
      // 3. Obtener los datos completos del usuario
      const userData = await getUserById(userId, token);

      // 4. Guardar el token y los datos del usuario
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Guardar también como cookie para el middleware
      setCookie(TOKEN_KEY, token);

      // Si el token original viene como playAttentionToken, guardar también con ese nombre
      if (loginResponse.playAttentionToken) {
        setCookie('playAttentionToken', loginResponse.playAttentionToken);
      }

      // 5. Devolver los datos y el token
      return {
        token,
        user: userData
      };
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      // Si falla la obtención del usuario, al menos guardamos el token
      // y los datos básicos del payload del token
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify({ id: userId }));

      // Guardar también como cookie para el middleware
      setCookie(TOKEN_KEY, token);

      // Si el token original viene como playAttentionToken, guardar también con ese nombre
      if (loginResponse.playAttentionToken) {
        setCookie('playAttentionToken', loginResponse.playAttentionToken);
      }

      return {
        token,
        user: { id: userId }
      };
    }
  },

  /**
   * Cerrar sesión del usuario
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Eliminar cookies
    document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `playAttentionToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },

  /**
   * Cambiar contraseña del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Resultado de la operación
   */
  async changePassword(currentPassword, newPassword) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    return await changePassword(currentPassword, newPassword, token);
  },

  /**
   * Solicitar restauración de contraseña olvidada
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  async forgotPassword(email) {
    return await forgotPassword(email);
  },

  /**
   * Obtener perfil del usuario autenticado
   * @returns {Promise<Object>} Datos del perfil de usuario
   */
  async getProfile() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    try {
      // Opción 1: Usar el endpoint de perfil si está disponible
      return await getProfile(token);
    } catch (error) {
      // Opción 2: Si falla, intentar obtener los datos del usuario por su ID
      const decoded = decodeToken(token);
      if (decoded && decoded.user) {
        return await getUserById(decoded.user, token);
      }
      throw error;
    }
  },

  /**
   * Obtener token de autenticación
   * @returns {string|null} Token de autenticación o null si no hay sesión
   */
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * Obtener datos del usuario actualmente autenticado
   * @returns {Object|null} Datos del usuario o null si no hay sesión
   */
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  /**
   * Verificar si hay un usuario autenticado
   * @returns {boolean} true si hay un usuario autenticado
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Obtener el ID del usuario actual
   * @returns {string|null} ID del usuario o null si no hay sesión
   */
  getCurrentUserId() {
    const token = this.getToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded && decoded.user ? decoded.user : null;
  }
};
