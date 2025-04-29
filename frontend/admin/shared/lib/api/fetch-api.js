import { getApiUrl, fetchConfig } from './config';
import { AuthService } from '../services/auth-service';

/**
 * Función para realizar peticiones a la API con configuración por defecto
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones para fetch
 * @returns {Promise<any>} - Respuesta de la API
 */
export const fetchApi = async (endpoint, options = {}) => {
  const { headers = {}, withToken = true, ...fetchOptions } = options;

  // Construir la URL completa
  const url = getApiUrl(endpoint);

  // Configuración por defecto
  const defaultHeaders = {
    ...fetchConfig.defaultOptions.headers,
    ...headers
  };

  // Si se requiere autenticación, añadir el token
  if (withToken) {
    const token = AuthService.getToken();
    if (token) {
      Object.assign(defaultHeaders, fetchConfig.authHeaders(token));
    }
  }

  // Realizar la petición
  const response = await fetch(url, {
    ...fetchOptions,
    headers: defaultHeaders
  });

  // Parsear la respuesta
  const data = await response.json();

  // Si la respuesta no es exitosa, lanzar error
  if (!response.ok) {
    const error = new Error(data.message || `Error en petición a ${endpoint}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
