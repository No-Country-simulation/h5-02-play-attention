/**
 * Adaptadores para engagements (contactos con leads)
 * Convierten los datos entre el formato de la API y el formato del frontend
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adapta un engagement del frontend al formato esperado por la API
 * @param {Object} contactData - Datos del contacto en formato frontend
 * @returns {Object} - Datos formateados para la API
 */
export const engagementToApiAdapter = contactData => {
  return {
    lead_id: contactData.leadId,
    contact_type: mapContactTypeToApi(contactData.type),
    contact_date: contactData.date,
    subject: contactData.subject || '',
    detail: contactData.content || '',
    response: contactData.outcome || ''
  };
};

/**
 * Adapta un engagement desde la API al formato del frontend
 * @param {Object} apiData - Datos del contacto desde la API
 * @returns {Object} - Datos formateados para el frontend
 */
export const apiToEngagementAdapter = apiData => {
  // Asegurarnos de que apiData existe
  if (!apiData) return null;

  return {
    id: apiData.id || apiData._id || '',
    leadId: apiData.lead_id || '',
    type: mapApiContactTypeToFrontend(apiData.contact_type || ''),
    date: apiData.contact_date || new Date().toISOString(),
    user: apiData.created_by || 'sistema',
    subject: apiData.subject || '',
    content: apiData.detail || '',
    outcome: apiData.response || ''
  };
};

/**
 * Adapta una lista de engagements desde la API
 * @param {Object} apiResponse - Respuesta completa de la API
 * @returns {Array} - Lista formateada para el frontend
 */
export const apiEngagementsListAdapter = (apiResponse = {}) => {

  // Si no hay respuesta o no tiene datos, devolver array vacío
  if (!apiResponse) {
    console.log('No API response to process');
    return [];
  }

  // Extraer el array de engagements de la propiedad 'data'
  const engagements = apiResponse.data || [];

  if (engagements.length === 0) {
    console.log('No engagements data found in the response');
    return [];
  }



  const result = engagements
    .map(engagement => {

      return apiToEngagementAdapter(engagement);
    })
    .filter(Boolean) // Eliminar elementos null
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Más recientes primero

  return result;
};

/**
 * Mapea el tipo de contacto del frontend al formato de la API
 * @param {string} type - Tipo de contacto en el frontend
 * @returns {string} - Tipo de contacto para la API
 */
function mapContactTypeToApi(type) {
  const typeMap = {
    email: 'email',
    call: 'phonecall',
    meeting: 'meeting',
    message: 'whatsapp',
    note: 'other'
  };

  return typeMap[type] || 'other';
}

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
