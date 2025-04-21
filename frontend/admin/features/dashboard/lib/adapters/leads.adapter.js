/**
 * Adaptador para leads del dashboard
 * Convierte los datos de leads de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para leads recientes
 * @param {Array} apiLeads - Datos crudos de leads desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const leadsAdapter = (apiLeads = []) => {
  if (!apiLeads.length) return [];

  return apiLeads.map(lead => ({
    id: lead.id || '',
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    company: lead.company || '',
    service: determineService(lead),
    status: determineStatus(lead.status),
    message: lead.message || '',
    createdAt: lead.createdAt || new Date().toISOString()
  }));
};

/**
 * Determina el servicio basado en los campos disponibles del lead
 * @param {Object} lead - Lead desde la API
 * @returns {string} - Servicio determinado
 */
function determineService(lead) {
  if (lead.service_professional) return 'Profesional';
  if (lead.chatbot) return 'Chatbot';
  if (lead.estudiante) return 'Estudiante';
  if (lead.calendario) return 'Calendario';

  return 'No especificado';
}

/**
 * Transforma los estados de la API a estados entendibles para el frontend
 * @param {string} status - Estado original del lead
 * @returns {string} - Estado transformado
 */
function determineStatus(status) {
  const statusMap = {
    active: 'activo',
    pending: 'pendiente',
    completed: 'completado'
  };

  return statusMap[status] || 'nuevo';
}
