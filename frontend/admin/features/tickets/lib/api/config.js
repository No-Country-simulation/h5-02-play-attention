/**
 * Configuración centralizada para las APIs de tickets de soporte
 * Sigue el principio SRP al contener sólo configuraciones y utilidades
 */

// URL base para todas las llamadas a la API
export const API_URL = 'https://play-attention.onrender.com/api';

// Headers comunes para todas las peticiones
export const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

/**
 * Mapea el estado del ticket del frontend al formato esperado por el backend
 * @param {string} status - Estado del ticket en el frontend
 * @returns {string} - Estado del ticket para el backend
 */
export function mapTicketStatusToBackend(status) {
  const statusMap = {
    abierto: 'open',
    'en proceso': 'in_progress',
    resuelto: 'resolved',
    cerrado: 'closed'
  };

  return statusMap[status.toLowerCase()] || 'open';
}

/**
 * Mapea el estado del ticket del backend al formato usado en el frontend
 * @param {string} status - Estado del ticket del backend
 * @returns {string} - Estado del ticket para el frontend
 */
export function mapTicketStatusToFrontend(status) {
  if (!status) return 'abierto';

  const statusMap = {
    open: 'abierto',
    in_progress: 'en proceso',
    resolved: 'resuelto',
    closed: 'cerrado'
  };

  return statusMap[status.toLowerCase()] || 'abierto';
}

/**
 * Mapea la prioridad del ticket para frontend y backend
 * @param {string} priority - Prioridad del ticket
 * @returns {string} - Prioridad mapeada
 */
export function mapTicketPriority(priority) {
  const priorityMap = {
    alta: 'high',
    media: 'medium',
    baja: 'low',
    high: 'alta',
    medium: 'media',
    low: 'baja'
  };

  return priorityMap[priority.toLowerCase()] || priority;
}

/**
 * Maneja errores de respuesta HTTP
 * @param {Response} response - Respuesta del fetch
 * @returns {Promise<string>} - Mensaje de error formateado
 */
export async function handleResponseError(response) {
  let errorText = '';
  try {
    const errorResponse = await response.json();
    errorText = JSON.stringify(errorResponse);
  } catch (parseError) {
    try {
      errorText = await response.text();
    } catch (textError) {
      errorText = 'No se pudo leer la respuesta de error';
    }
  }
  return `Error ${response.status}: ${errorText}`;
}
