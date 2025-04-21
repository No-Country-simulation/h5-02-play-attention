/**
 * Adaptadores para la feature de leads
 * Convierten los datos de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

import { statusConfig } from '../config/mock-data';

/**
 * Adaptador para leads
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
    position: lead.position || '',
    source: lead.source || 'Desconocido',
    status: lead.status || 'nuevo',
    priority: lead.priority || 'media',
    createdAt: lead.createdAt || new Date().toISOString(),
    updatedAt: lead.updatedAt || lead.createdAt || new Date().toISOString(),
    lastContact: lead.lastContact || null,
    notes: lead.notes || '',
    service: mapServices(lead),
    tags: lead.tags || []
  }));
};

/**
 * Adaptador para un solo lead
 * @param {Object} apiLead - Datos crudos de un lead desde la API
 * @returns {Object} - Datos formateados para el frontend
 */
export const leadAdapter = (apiLead = {}) => {
  if (!apiLead || !apiLead.id) return null;

  return {
    id: apiLead.id || '',
    name: apiLead.name || '',
    email: apiLead.email || '',
    phone: apiLead.phone || '',
    company: apiLead.company || '',
    position: apiLead.position || '',
    source: apiLead.source || 'Desconocido',
    status: apiLead.status || 'nuevo',
    priority: apiLead.priority || 'media',
    createdAt: apiLead.createdAt || new Date().toISOString(),
    updatedAt:
      apiLead.updatedAt || apiLead.createdAt || new Date().toISOString(),
    lastContact: apiLead.lastContact || null,
    notes: apiLead.notes || '',
    service: mapServices(apiLead),
    tags: apiLead.tags || []
  };
};

/**
 * Mapea los servicios desde el formato de la API
 * @param {Object} lead - Lead con datos de servicio
 * @returns {Object} - Objeto de servicios normalizado
 */
function mapServices(lead) {
  // Si ya viene como objeto con booleanos
  if (lead.service && typeof lead.service === 'object') {
    return {
      professional: Boolean(lead.service.professional),
      chatbot: Boolean(lead.service.chatbot),
      estudiante: Boolean(lead.service.estudiante),
      calendario: Boolean(lead.service.calendario)
    };
  }

  // Si viene como campos independientes o en otro formato
  return {
    professional: Boolean(lead.service_professional),
    chatbot: Boolean(lead.chatbot),
    estudiante: Boolean(lead.estudiante),
    calendario: Boolean(lead.calendario)
  };
}
