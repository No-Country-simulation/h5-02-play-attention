/**
 * Configuración centralizada para las APIs de contenido
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
 * Mapea el tipo de contenido del frontend al formato esperado por el backend
 * @param {string} type - Tipo de contenido en el frontend
 * @returns {string} - Tipo de contenido para el backend
 */
export function mapContentTypeToBackend(type) {
  const typeMap = {
    Artículo: 'article',
    Video: 'video',
    PDF: 'pdf',
    Presentación: 'presentation'
  };
  return typeMap[type] || 'article';
}

/**
 * Mapea el tipo de contenido del backend al formato usado en el frontend
 * @param {string} type - Tipo de contenido del backend
 * @returns {string} - Tipo de contenido para el frontend
 */
export function mapContentTypeToFrontend(type) {
  const typeMap = {
    article: 'Artículo',
    video: 'Video',
    pdf: 'PDF',
    presentation: 'Presentación'
  };
  return typeMap[type] || 'Artículo';
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
