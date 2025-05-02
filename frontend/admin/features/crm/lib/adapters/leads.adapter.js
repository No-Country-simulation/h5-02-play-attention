/**
 * Adaptadores para datos de leads
 * Convierten los datos de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para leads
 * @param {Array|Object} apiLeads - Datos crudos de leads desde la API
 * @returns {Array|Object} - Datos formateados para el frontend
 */
export const leadsAdapter = apiLeads => {
  // Si es un array, procesamos todos los leads
  if (Array.isArray(apiLeads)) {
    return apiLeads.map(lead => adaptLead(lead));
  }
  // Si es un objeto (un solo lead), lo adaptamos directamente
  return adaptLead(apiLeads);
};

/**
 * Adapta un objeto lead individual
 * @param {Object} lead - Lead desde la API
 * @returns {Object} - Lead adaptado al formato del frontend
 */
const adaptLead = lead => {
  if (!lead) return null;

  // Asegurar que el lead tenga un ID
  if (!lead.id || lead.id === '') {
    let tempId = '';
    if (lead._id) {
      tempId = lead._id;
    } else if (lead.email) {
      tempId = `temp-${lead.email.replace(/[^a-zA-Z0-9]/g, '')}`;
    } else if (lead.fullname || lead.name) {
      tempId = `temp-${(lead.fullname || lead.name).replace(
        /[^a-zA-Z0-9]/g,
        ''
      )}`;
    } else {
      tempId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
    }

    lead.id = tempId;
  }

  return {
    id: lead.id,
    name: lead.fullname || lead.name || '', // Usamos fullname o name si existe
    email: lead.email || '',
    phone: lead.phone || '',
    company: lead.company || '',
    position: lead.relation || lead.position || '',
    userType: mapServiceToUserType(lead.service),
    status: normalizeStatus(lead.status),
    source: lead.origen || lead.source || '',
    notes: lead.message || lead.notes || '',
    createdAt: lead.createdAt || new Date().toISOString(),
    updatedAt: lead.updatedAt || null,
    newsletter: lead.newsletter === true // Convertimos a booleano explícito
  };
};

/**
 * Mapea el servicio de la API al tipo de usuario del frontend
 * @param {string} service - Servicio desde la API
 * @returns {string} - Tipo de usuario para el frontend
 */
const mapServiceToUserType = service => {
  if (!service) return 'persona';

  const serviceMap = {
    Profesional: 'profesional',
    'Persona Individual': 'persona',
    Individuo: 'persona', // Mantener compatibilidad con datos antiguos
    Empresa: 'empresa'
  };

  return serviceMap[service] || 'persona';
};

/**
 * Normaliza el estado del lead para el frontend
 * @param {string} status - Estado desde la API
 * @returns {string} - Estado normalizado
 */
const normalizeStatus = status => {
  if (!status) return 'nuevo';

  // Normalizar a minúsculas para comparación
  const statusLower = status.toLowerCase().trim();

  // Mapeo simple y directo
  if (statusLower === 'activo') return 'proceso';
  if (statusLower === 'nuevo') return 'nuevo';
  if (statusLower === 'cliente') return 'cliente';
  if (statusLower === 'no interesado') return 'no_interesado';

  // Si el estado ya es uno de los valores de UI, devolverlo tal cual
  if (['nuevo', 'proceso', 'cliente', 'no_interesado'].includes(statusLower)) {
    return statusLower;
  }

  // Valor por defecto
  return 'nuevo';
};

export default leadsAdapter;
