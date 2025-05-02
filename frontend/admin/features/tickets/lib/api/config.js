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
    'en proceso': 'progress',
    'en revisión': 'review',
    'pendiente de usuario': 'pending_user',
    'pendiente de equipo': 'pending_team',
    resuelto: 'resolved',
    cerrado: 'closed',
    reabierto: 'reopened'
  };

  // Valor por defecto si no hay coincidencia
  const defaultStatus = 'open';

  console.log(
    `[DEBUG] Mapeando estado de ticket: "${status}" -> "${
      statusMap[status?.toLowerCase()] || defaultStatus
    }"`
  );

  return statusMap[status?.toLowerCase()] || defaultStatus;
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
    progress: 'en proceso',
    review: 'en revisión',
    pending_user: 'pendiente de usuario',
    pending_team: 'pendiente de equipo',
    resolved: 'resuelto',
    closed: 'cerrado',
    reopened: 'reabierto'
  };

  return statusMap[status?.toLowerCase()] || 'abierto';
}

/**
 * Asegura que ticket_origin sea exactamente uno de los valores esperados por el backend
 * @param {string} origin - Origen del ticket desde el frontend
 * @returns {string} - Valor exacto esperado por el backend
 */
export function validateTicketOrigin(origin) {
  // Lista exacta de valores permitidos por el backend
  const validOrigins = ['crm', 'user_platform', 'admin_panel'];

  // Verificar si el valor es exactamente igual a uno de los permitidos
  if (validOrigins.includes(origin)) {
    console.log(`[DEBUG] Origen del ticket válido: "${origin}"`);
    return origin;
  }

  // Si no es un valor válido, intentar normalizar
  console.warn(`[WARN] Origen del ticket inválido: "${origin}"`);

  // Asegurar que sea string y normalizar a minúsculas sin espacios
  const normalizedOrigin = String(origin || '')
    .toLowerCase()
    .trim();

  // Mapeo específico por si hay variaciones comunes
  const originMap = {
    crm: 'crm',
    external: 'admin_panel',
    externo: 'admin_panel',
    'panel de admin': 'admin_panel',
    'panel admin': 'admin_panel',
    admin: 'admin_panel',
    wxternal: 'admin_panel',
    platform: 'user_platform',
    plataforma: 'user_platform',
    'user platform': 'user_platform',
    userplatform: 'user_platform',
    user_plataform: 'user_platform',
    userplataform: 'user_platform'
  };

  // Verificar si hay un mapeo directo
  if (originMap[normalizedOrigin]) {
    const mappedValue = originMap[normalizedOrigin];
    console.log(`[DEBUG] Origen mapeado: "${origin}" -> "${mappedValue}"`);
    return mappedValue;
  }

  // Si todo falla, usar valor por defecto
  console.error(
    `[ERROR] No se pudo mapear el origen "${origin}", usando valor por defecto: "crm"`
  );
  return 'crm';
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
