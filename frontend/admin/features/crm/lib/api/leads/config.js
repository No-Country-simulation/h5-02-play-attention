/**
 * Configuración centralizada para las APIs
 * Sigue el principio SRP al contener sólo configuraciones
 */

// URL base para todas las llamadas a la API
export const API_URL = 'https://play-attention.onrender.com/api';

// Headers comunes para todas las peticiones
export const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

/**
 * Mapea el tipo de usuario al servicio que espera el backend
 * @param {string} userType - Tipo de usuario en el frontend
 * @returns {string} - Servicio en formato para el backend
 */
export function mapUserTypeToService(userType) {
  const serviceMap = {
    persona: 'Persona individual',
    profesional: 'Profesional',
    empresa: 'Empresa'
  };
  return serviceMap[userType] || 'Persona individual';
}

/**
 * Mapea el origen a los valores exactos que espera el backend
 * @param {string} source - Origen en el frontend
 * @returns {string} - Origen en formato para el backend
 */
export function mapSourceToBackend(source) {
  const sourceMap = {
    'Sitio web': 'Sitio web',
    'Formulario Landing': 'Sitio web',
    WhatsApp: 'Whatsapp',
    'Redes sociales': 'Redes sociales',
    Recomendación: 'Referencia',
    Otro: 'Otro',
    LinkedIn: 'LinkedIn'
  };
  return sourceMap[source] || 'Sitio web';
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
