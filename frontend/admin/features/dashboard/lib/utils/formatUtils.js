/**
 * Utilidades de formato para el dashboard
 * Centralizadas para evitar duplicación y seguir el principio DRY
 */

/**
 * Formatea una fecha en formato relativo (hace X minutos, horas, días)
 * @param {string} dateString - String de fecha en formato ISO
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
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }
}

/**
 * Obtiene el valor de una variable CSS de color
 * @param {string} color - Nombre del color (semántico o básico)
 * @returns {string} - Valor CSS del color (por ejemplo, var(--color-leads))
 */
export function getColorCode(color) {
  // Mapeo de colores a variables CSS
  const colorMap = {
    // Colores básicos
    red: 'var(--color-notifications)',
    green: 'var(--color-leads)',
    blue: 'var(--color-users)',
    amber: 'var(--color-tickets)',
    indigo: 'var(--color-conversions)',
    purple: 'var(--color-content)',
    pink: 'var(--primary)',
    gray: 'var(--color-neutral)',

    // Colores semánticos
    leads: 'var(--color-leads)',
    tickets: 'var(--color-tickets)',
    content: 'var(--color-content)',
    users: 'var(--color-users)',
    events: 'var(--color-events)',
    notifications: 'var(--color-notifications)',
    conversions: 'var(--color-conversions)',
    finance: 'var(--color-finance)',
    neutral: 'var(--color-neutral)'
  };

  return colorMap[color] || 'var(--color-neutral)';
}
