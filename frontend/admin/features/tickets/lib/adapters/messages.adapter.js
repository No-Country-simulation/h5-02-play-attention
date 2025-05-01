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

  // Extraer información del usuario basado en las propiedades disponibles
  const getUserInfo = () => {
    // Si existe user_id como objeto (nueva estructura)
    if (apiMessage.user_id && typeof apiMessage.user_id === 'object') {
      return {
        user:
          apiMessage.user_id.fullname ||
          apiMessage.user_id.name ||
          apiMessage.user_id.email ||
          'Usuario desconocido',
        userId: apiMessage.user_id._id || apiMessage.user_id.id || '',
        userEmail: apiMessage.user_id.email || ''
      };
    }

    // Si user_id es un string (ID de usuario)
    if (apiMessage.user_id && typeof apiMessage.user_id === 'string') {
      return {
        user: apiMessage.user || 'Usuario desconocido',
        userId: apiMessage.user_id,
        userEmail: apiMessage.userEmail || apiMessage.user_email || ''
      };
    }

    // Si user es un objeto (estructura anterior)
    if (typeof apiMessage.user === 'object' && apiMessage.user) {
      return {
        user:
          apiMessage.user.name ||
          apiMessage.user.fullname ||
          apiMessage.user.email ||
          'Usuario desconocido',
        userId: apiMessage.user._id || apiMessage.user.id || '',
        userEmail: apiMessage.user.email || ''
      };
    }

    // Si tenemos userId pero no user object
    if (apiMessage.userId || apiMessage.user_id) {
      const userId = apiMessage.userId || apiMessage.user_id;
      return {
        user: apiMessage.user || 'Usuario desconocido',
        userId: typeof userId === 'object' ? userId.id || userId._id : userId,
        userEmail: apiMessage.userEmail || apiMessage.user_email || ''
      };
    }

    // Si solo tenemos el nombre de usuario como string
    return {
      user: apiMessage.user || 'Usuario desconocido',
      userId: '',
      userEmail: ''
    };
  };

  const userInfo = getUserInfo();

  // Log para debugging
  console.log('messageAdapter procesando mensaje:', {
    id: apiMessage._id || apiMessage.id,
    userInfo: userInfo,
    apiUser: apiMessage.user,
    apiUserId: apiMessage.userId || apiMessage.user_id
  });

  return {
    id: apiMessage._id || apiMessage.id || '',
    content:
      apiMessage.content ||
      apiMessage.text ||
      apiMessage.description ||
      apiMessage.message ||
      '',
    ticketId:
      apiMessage.ticketId || apiMessage.ticket_id || apiMessage.ticket || '',
    user: userInfo.user,
    userId: userInfo.userId,
    userEmail: userInfo.userEmail,
    userType: apiMessage.userType || apiMessage.user_type || 'user',
    isAdmin:
      apiMessage.userType === 'admin' ||
      apiMessage.user_type === 'admin' ||
      apiMessage.isAdmin ||
      false,
    date: formatDate(
      apiMessage.createdAt || apiMessage.created_at || apiMessage.date
    ),
    updated: formatDate(
      apiMessage.updatedAt || apiMessage.updated_at || apiMessage.updated
    ),
    attachments: apiMessage.attachments || []
  };
};

/**
 * Adaptador para lista de mensajes
 * @param {Array|Object} apiResponse - Datos crudos de mensajes desde la API o objeto paginado
 * @returns {Object} - Datos formateados para el frontend con paginación si existe
 */
export const messagesAdapter = (apiResponse = []) => {
  console.log('messagesAdapter recibió:', apiResponse);

  // Caso para la nueva estructura con @messages
  if (
    apiResponse &&
    apiResponse['@messages'] &&
    Array.isArray(apiResponse['@messages'])
  ) {
    console.log('FORMATO DETECTADO: Nueva API con @messages');

    // Adaptar cada mensaje en el array de datos
    const adaptedMessages = apiResponse['@messages'].map(message =>
      messageAdapter(message)
    );
    console.log('Mensajes adaptados:', adaptedMessages.length, adaptedMessages);

    return {
      messages: adaptedMessages,
      total: apiResponse.total || adaptedMessages.length,
      currentPage: apiResponse.page || 1,
      totalPages: apiResponse.pageCount || 1
    };
  }

  // Si la respuesta tiene un campo 'data' que contiene los mensajes (formato común en APIs)
  if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
    console.log('FORMATO DETECTADO: API con data array');

    const adaptedMessages = apiResponse.data.map(message =>
      messageAdapter(message)
    );

    return {
      messages: adaptedMessages,
      total: apiResponse.total || adaptedMessages.length,
      currentPage: apiResponse.page || apiResponse.currentPage || 1,
      totalPages: apiResponse.pageCount || apiResponse.totalPages || 1
    };
  }

  // Si la respuesta es un objeto con estructura de paginación
  if (apiResponse && !Array.isArray(apiResponse) && apiResponse.messages) {
    console.log('FORMATO DETECTADO: Objeto con campo messages');

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
    console.log('FORMATO DETECTADO: Array simple de mensajes');

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
