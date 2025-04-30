/**
 * Configuración de la API para la conexión con el backend
 */

// URL base de la API - por defecto apunta al backend en el puerto 3001
const API_URL =
  // Primero intentamos obtener del env (Next.js)
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  // Si no está disponible, intentamos leer de window (cliente)
  (typeof window !== 'undefined' && window.__API_URL__) ||
  // Valor por defecto
  'https://play-attention.onrender.com';

// Función para establecer la URL de la API en tiempo de ejecución (cliente)
export const setApiUrl = url => {
  if (typeof window !== 'undefined') {
    window.__API_URL__ = url;
  }
};

// Endpoints específicos
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    forgotPassword: `${API_URL}/api/auth/forgot-password`,
    changePassword: `${API_URL}/api/auth/change-password`,
    resetPassword: `${API_URL}/api/auth/reset-password`,
    confirmToken: `${API_URL}/api/auth/confirm-token`,
    profile: `${API_URL}/api/auth/profile`
  },
  // Usuarios
  users: {
    getById: id => `${API_URL}/api/users/${id}`,
    list: `${API_URL}/api/users`,
    create: `${API_URL}/api/users`,
    update: id => `${API_URL}/api/users/${id}`,
    delete: id => `${API_URL}/api/users/${id}`
  }
  // Otros endpoints aquí
};

/**
 * Configuración general para las peticiones fetch
 */
export const fetchConfig = {
  // Opciones por defecto para todas las peticiones
  defaultOptions: {
    headers: {
      'Content-Type': 'application/json'
    }
  },

  // Función para añadir el token de autenticación a las cabeceras
  authHeaders: token => ({
    Authorization: `Bearer ${token}`
  })
};

/**
 * Función para construir la URL completa de un endpoint
 * @param {string} endpoint - Endpoint relativo de la API
 * @returns {string} URL completa del endpoint
 */
export const getApiUrl = endpoint => {
  // Si el endpoint ya es una URL completa, devolverla tal cual
  if (endpoint.startsWith('http')) {
    return endpoint;
  }

  // Si el endpoint comienza con /, asumimos que es relativo a la URL base
  if (endpoint.startsWith('/')) {
    return `${API_URL}${endpoint}`;
  }

  // Si no, asumimos que es relativo a la URL base + /api
  return `${API_URL}/api/${endpoint}`;
};
