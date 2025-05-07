/**
 * Configuración centralizada para APIs
 * Este archivo contiene las configuraciones comunes para las peticiones a la API del backend
 */
import { getAuthTokenFromCookie } from '../utils/cookies';

// URL base del backend
export const API_BASE_URL = 'https://play-attention.onrender.com/api';

// Endpoints específicos
export const ENDPOINTS = {
  SUPPORT_TICKETS: `${API_BASE_URL}/support-tickets`,
  SUPPORT_MESSAGES: `${API_BASE_URL}/support-messages`
};

/**
 * Obtiene los headers comunes para las peticiones incluyendo el token de autenticación
 * @returns {Object} Headers con autorización si está disponible
 */
export const getAuthHeaders = () => {
  const token = getAuthTokenFromCookie();
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Headers comunes para las peticiones
export const DEFAULT_HEADERS = getAuthHeaders();

/**
 * Construye una URL completa con parámetros de consulta
 * @param {string} endpoint - Endpoint base
 * @param {Object} params - Parámetros de consulta
 * @returns {string} URL completa con query params
 */
export const buildUrl = (endpoint, params = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};
