/**
 * Utilidades de formateo para la feature de leads
 * Contiene funciones para formateo de fechas y otros datos
 * Siguiendo el principio DRY (Don't Repeat Yourself)
 */

/**
 * Formatea una fecha en formato legible
 * @param {string} dateString - String de fecha ISO
 * @param {Object} options - Opciones de formato
 * @returns {string} - Fecha formateada
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '-';

  const date = new Date(dateString);

  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  const formatOptions = { ...defaultOptions, ...options };

  return date.toLocaleDateString('es-ES', formatOptions);
}

/**
 * Formatea una fecha en formato relativo (hace X minutos, horas, días)
 * @param {string} dateString - String de fecha ISO
 * @returns {string} - Texto formateado en formato relativo
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `Hace ${diffMins} min`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} h`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else {
    return formatDate(dateString, { day: 'numeric', month: 'short' });
  }
}

/**
 * Formatea un teléfono para mostrar en UI
 * @param {string} phone - Número de teléfono
 * @returns {string} - Teléfono formateado
 */
export function formatPhone(phone) {
  if (!phone) return '';

  // Simplemente devolvemos el teléfono tal cual (esto se puede personalizar)
  return phone;
}

/**
 * Genera iniciales a partir del nombre (para avatares)
 * @param {string} name - Nombre completo
 * @returns {string} - Iniciales (máximo 2)
 */
export function getInitials(name) {
  if (!name) return '?';

  const parts = name.split(' ').filter(part => part.length > 0);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
} 