/**
 * Adaptador para tickets del dashboard
 * Convierte los datos de tickets de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para tickets recientes
 * @param {Array} apiTickets - Datos crudos de tickets desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const ticketsAdapter = (apiTickets = []) => {
  if (!apiTickets.length) return [];

  return apiTickets.map(ticket => ({
    id: ticket.id || '',
    subject: ticket.title || '',
    status: ticket.status || 'active',
    priority: determinePriority(ticket),
    createdAt: ticket.createdAt || new Date().toISOString(),
    user: {
      name: ticket.id_profile || 'Usuario'
    },
    message: ticket.message || ''
  }));
};

/**
 * Determina la prioridad del ticket basado en su contenido o metadatos
 * @param {Object} ticket - Ticket desde la API
 * @returns {string} - Prioridad determinada (alta, media, baja)
 */
function determinePriority(ticket) {
  if (ticket.message && ticket.message.toLowerCase().includes('urgente')) {
    return 'alta';
  }

  return 'media';
}
