/**
 * Utilidades para notificaciones
 * Encapsula funciones comunes utilizadas por los componentes de notificaciones
 */

/**
 * Formatea el tipo de notificación para mostrar en la interfaz
 * @param {string} type - Tipo de notificación (ticket, user, lead)
 * @returns {string} Texto formateado
 */
export function formatNotificationType(type) {
  const types = {
    ticket: 'Ticket',
    user: 'Usuario',
    lead: 'Lead'
  };

  return types[type] || 'Desconocido';
}

/**
 * Formatea el estado de la notificación para mostrar en la interfaz
 * @param {string} status - Estado de la notificación (read, unread)
 * @returns {string} Texto formateado
 */
export function formatNotificationStatus(status) {
  const statuses = {
    read: 'Leída',
    unread: 'No leída'
  };

  return statuses[status] || 'Desconocido';
}

/**
 * Obtiene clases CSS para el badge de tipo de notificación
 * @param {string} type - Tipo de notificación
 * @returns {string} Clases CSS
 */
export function getNotificationTypeClasses(type) {
  const classes = {
    ticket: 'bg-blue-100 text-blue-700',
    user: 'bg-green-100 text-green-700',
    lead: 'bg-purple-100 text-purple-700'
  };

  return classes[type] || 'bg-gray-100 text-gray-700';
}

/**
 * Trunca un texto largo a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima (por defecto 100)
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;

  return `${text.slice(0, maxLength)}...`;
}

/**
 * Genera un ID único para notificaciones (demo)
 * @returns {string} ID único
 */
export function generateUniqueId() {
  return `notification_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/**
 * Ordena notificaciones por fecha (más recientes primero)
 * @param {Array} notifications - Array de notificaciones
 * @returns {Array} Notificaciones ordenadas
 */
export function sortNotificationsByDate(notifications) {
  return [...notifications].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}

/**
 * Agrupa notificaciones por tipo
 * @param {Array} notifications - Array de notificaciones
 * @returns {Object} Objeto con notificaciones agrupadas por tipo
 */
export function groupNotificationsByType(notifications) {
  return notifications.reduce((acc, notification) => {
    const type = notification.type || 'other';

    if (!acc[type]) {
      acc[type] = [];
    }

    acc[type].push(notification);
    return acc;
  }, {});
}
