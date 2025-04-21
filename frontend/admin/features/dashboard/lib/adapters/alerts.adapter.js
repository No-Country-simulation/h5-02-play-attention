/**
 * Adaptador para alertas del dashboard
 * Convierte los datos de alertas de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para alertas
 * @param {Array} apiAlerts - Datos crudos de alertas desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const alertsAdapter = (apiAlerts = []) => {
  if (!apiAlerts.length) return [];

  // Mapeo de tipos a iconos para alertas
  const typeToIconMap = {
    lead: 'userPlus',
    ticket: 'ticketCheck',
    content: 'fileText',
    event: 'clock',
    user: 'users',
    system: 'bell',
    finance: 'bell',
    default: 'bell'
  };

  return apiAlerts.map(alert => ({
    id: alert.id || Math.random().toString(36).substr(2, 9),
    title: alert.title || '',
    description: alert.description || '',
    type: alert.type || 'info',
    icon: alert.icon || typeToIconMap[alert.type] || typeToIconMap.default,
    color: alert.severity || alert.color || 'info',
    actionText: alert.actionText || 'Ver detalles',
    actionUrl: alert.actionUrl || alert.url || '/'
  }));
};
