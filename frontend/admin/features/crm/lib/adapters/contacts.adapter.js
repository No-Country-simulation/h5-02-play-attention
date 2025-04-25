/**
 * Adaptadores para contactos de leads
 * Convierten los datos de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para historial de contactos de un lead
 * @param {Array} apiContacts - Datos crudos de contactos desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const contactHistoryAdapter = (apiContacts = []) => {
  if (!apiContacts.length) return [];

  return apiContacts
    .map(contact => ({
      id: contact.id || contact._id || '',
      leadId: contact.leadId || contact.lead_id || '',
      type: mapApiContactTypeToFrontend(
        contact.contact_type || contact.type || 'other'
      ),
      date: contact.contact_date || contact.date || new Date().toISOString(),
      user: contact.user || 'Sistema',
      subject: contact.subject || '',
      content: contact.detail || contact.content || '',
      outcome: contact.response || contact.outcome || ''
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha descendente
};

/**
 * Mapea el tipo de contacto de la API al formato del frontend
 * @param {string} apiType - Tipo de contacto desde la API
 * @returns {string} - Tipo de contacto para el frontend
 */
function mapApiContactTypeToFrontend(apiType) {
  if (!apiType) return 'note';

  const typeMap = {
    email: 'email',
    phonecall: 'call',
    meeting: 'meeting',
    whatsapp: 'message',
    other: 'note'
  };

  return typeMap[apiType.toLowerCase()] || 'note';
}

/**
 * Obtiene el icono correspondiente al tipo de contacto
 * @param {string} contactType - Tipo de contacto (email, call, meeting, other)
 * @returns {string} - Nombre del icono a utilizar
 */
export const getContactTypeIcon = contactType => {
  const iconMap = {
    email: 'mail',
    call: 'phone',
    meeting: 'users',
    message: 'message-circle',
    note: 'file-text',
    other: 'activity'
  };

  return iconMap[contactType] || iconMap.other;
};

/**
 * Obtiene el color para el tipo de contacto
 * @param {string} contactType - Tipo de contacto
 * @returns {string} - Nombre del color semántico a utilizar
 */
export const getContactTypeColor = contactType => {
  const colorMap = {
    email: 'info',
    call: 'leads',
    meeting: 'content',
    message: 'tickets',
    note: 'neutral',
    other: 'neutral'
  };

  return colorMap[contactType] || colorMap.other;
};
