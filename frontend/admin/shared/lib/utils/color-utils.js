/**
 * Utilidades para manejar colores en la aplicación
 * Centraliza la asignación de colores semánticos para mejorar la coherencia visual
 */

/**
 * Mapa de colores semánticos a clases de Tailwind
 * Utilizado para mantener la consistencia y reducir la variedad de colores
 */
const SEMANTIC_COLORS = {
  // Colores primarios (derivados de las variables CSS)
  primary: {
    text: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary'
  },

  // Colores por categoría de funcionalidad
  leads: {
    text: 'text-leads',
    bg: 'bg-leads-light',
    border: 'border-leads'
  },
  users: {
    text: 'text-users',
    bg: 'bg-users-light',
    border: 'border-users'
  },
  content: {
    text: 'text-content',
    bg: 'bg-content-light',
    border: 'border-content'
  },
  tickets: {
    text: 'text-tickets',
    bg: 'bg-tickets-light',
    border: 'border-tickets'
  },
  notifications: {
    text: 'text-notifications',
    bg: 'bg-notifications-light',
    border: 'border-notifications'
  },
  conversions: {
    text: 'text-conversions',
    bg: 'bg-conversions-light',
    border: 'border-conversions'
  },
  finance: {
    text: 'text-finance',
    bg: 'bg-finance-light',
    border: 'border-finance'
  },
  events: {
    text: 'text-events',
    bg: 'bg-events-light',
    border: 'border-events'
  },

  // Colores de estado
  success: {
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success'
  },
  warning: {
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning'
  },
  danger: {
    text: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive'
  },
  info: {
    text: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info'
  },

  // Colores neutros
  neutral: {
    text: 'text-neutral',
    bg: 'bg-neutral-light',
    border: 'border-neutral'
  }
};

/**
 * Mapeo de colores antiguos a colores semánticos
 * Facilita la transición y mantiene compatibilidad con código existente
 */
const COLOR_MAPPING = {
  // Colores básicos a semánticos
  blue: 'users',
  green: 'leads',
  red: 'notifications',
  amber: 'tickets',
  yellow: 'finance',
  purple: 'primary',
  indigo: 'conversions',
  pink: 'primary',
  gray: 'neutral',

  // Estados a sus equivalentes semánticos
  success: 'leads',
  warning: 'tickets',
  danger: 'notifications',
  info: 'users'
};

/**
 * Convierte un color (antiguo o semántico) a su versión semántica
 * @param {string} color - Color a convertir
 * @returns {string} - Color semántico correspondiente
 */
export function getSemanticColor(color) {
  return COLOR_MAPPING[color] || color;
}

/**
 * Devuelve la clase CSS para texto de un color semántico
 * @param {string} color - Color (antiguo o semántico)
 * @returns {string} - Clase CSS para color de texto
 */
export function getTextColorClass(color) {
  const semanticColor = getSemanticColor(color);
  return `text-${semanticColor}`;
}

/**
 * Devuelve la clase CSS para fondo de un color semántico
 * @param {string} color - Color (antiguo o semántico)
 * @returns {string} - Clase CSS para color de fondo
 */
export function getBackgroundColorClass(color) {
  const semanticColor = getSemanticColor(color);
  return `bg-${semanticColor}-light`;
}

/**
 * Devuelve la clase CSS para borde de un color semántico
 * @param {string} color - Color (antiguo o semántico)
 * @returns {string} - Clase CSS para color de borde
 */
export function getBorderColorClass(color) {
  const semanticColor = getSemanticColor(color);
  return `border-${semanticColor}`;
}

/**
 * Mapeo de tipos de alertas a colores semánticos
 * Cada tipo de alerta tiene su color distintivo
 */
export const ALERT_TYPE_COLORS = {
  lead: 'leads',
  ticket: 'tickets',
  content: 'content',
  event: 'events',
  system: 'primary',
  user: 'users',
  finance: 'finance',
  notification: 'notifications',
  default: 'neutral'
};

/**
 * Obtiene el color semántico correspondiente a un tipo de alerta
 * @param {string} type - Tipo de alerta
 * @returns {string} - Color semántico
 */
export function getAlertTypeColor(type) {
  return ALERT_TYPE_COLORS[type] || ALERT_TYPE_COLORS.default;
}
