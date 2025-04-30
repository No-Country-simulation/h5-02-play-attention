/**
 * Adaptador para mensajes de soporte
 * Convierte los datos de mensajes de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para un único mensaje
 * @param {Object} apiMessage - Datos crudos de mensaje desde la API
 * @returns {Object} - Datos formateados para el frontend
 */
export const messageAdapter = (apiMessage = {}) => {
  if (!apiMessage) return null;

  // Formatear fechas en formato legible
  const formatDate = dateString => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  return {
    id: apiMessage._id || apiMessage.id || '',
    content: apiMessage.content || apiMessage.message || '',
    ticketId: apiMessage.ticketId || apiMessage.ticket || '',
    user:
      typeof apiMessage.user === 'object'
        ? apiMessage.user.name || apiMessage.user.email || 'Usuario desconocido'
        : apiMessage.user || 'Usuario desconocido',
    userId:
      typeof apiMessage.user === 'object'
        ? apiMessage.user._id || apiMessage.user.id || ''
        : apiMessage.userId || '',
    userType: apiMessage.userType || 'user',
    isAdmin: apiMessage.userType === 'admin' || apiMessage.isAdmin || false,
    date: formatDate(apiMessage.createdAt),
    updated: formatDate(apiMessage.updatedAt),
    attachments: apiMessage.attachments || []
  };
};

/**
 * Adaptador para lista de mensajes
 * @param {Array|Object} apiResponse - Datos crudos de mensajes desde la API o objeto paginado
 * @returns {Object} - Datos formateados para el frontend con paginación si existe
 */
export const messagesAdapter = (apiResponse = []) => {
  // Si la respuesta es un objeto con estructura de paginación
  if (apiResponse && !Array.isArray(apiResponse) && apiResponse.messages) {
    const { messages, total, currentPage, totalPages } = apiResponse;

    // Adaptar cada mensaje en el array de datos
    const adaptedMessages = Array.isArray(messages)
      ? messages.map(message => messageAdapter(message))
      : [];

    // Devolver objeto estructurado con paginación
    return {
      messages: adaptedMessages,
      total: total || adaptedMessages.length,
      currentPage: currentPage || 1,
      totalPages: totalPages || 1
    };
  }

  // Si la respuesta es simplemente un array de mensajes
  if (Array.isArray(apiResponse)) {
    const adaptedMessages = apiResponse.map(message => messageAdapter(message));
    return {
      messages: adaptedMessages,
      total: adaptedMessages.length,
      currentPage: 1,
      totalPages: 1
    };
  }

  // Fallback para respuestas imprevistas
  console.error(
    'Error: messagesAdapter esperaba un array o un objeto paginado pero recibió:',
    apiResponse
  );

  return {
    messages: [],
    total: 0,
    currentPage: 1,
    totalPages: 0
  };
};
