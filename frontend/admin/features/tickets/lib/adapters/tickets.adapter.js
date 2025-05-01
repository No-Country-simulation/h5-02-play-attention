/**
 * Adaptador para tickets de soporte
 * Convierte los datos de tickets de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

import { mapTicketStatusToFrontend, mapTicketPriority } from '../api/config';

/**
 * Adaptador para un único ticket
 * @param {Object} apiTicket - Datos crudos de ticket desde la API
 * @returns {Object} - Datos formateados para el frontend
 */
export const ticketAdapter = (apiTicket = {}) => {
  if (!apiTicket) return null;

  // Formatear fechas en formato legible
  const formatDate = dateString => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  return {
    id: apiTicket._id || apiTicket.id || '',
    subject: apiTicket.title || apiTicket.subject || 'Sin asunto',
    content:
      apiTicket.content || apiTicket.description || apiTicket.message || '',
    user:
      typeof apiTicket.user === 'object'
        ? apiTicket.user.name || apiTicket.user.email || 'Usuario desconocido'
        : apiTicket.user || 'Usuario desconocido',
    userId:
      typeof apiTicket.user === 'object'
        ? apiTicket.user._id || apiTicket.user.id || ''
        : apiTicket.userId || apiTicket.user_id || '',
    status: mapTicketStatusToFrontend(apiTicket.status),
    priority: mapTicketPriority(apiTicket.priority || 'media'),
    date: formatDate(apiTicket.createdAt || apiTicket.created_at),
    updated: formatDate(apiTicket.updatedAt || apiTicket.updated_at),
    responses: Array.isArray(apiTicket.responses)
      ? apiTicket.responses.map(response => ({
          id: response._id || response.id || '',
          content: response.content || '',
          user:
            typeof response.user === 'object'
              ? response.user.name ||
                response.user.email ||
                'Usuario desconocido'
              : response.user || 'Usuario desconocido',
          date: formatDate(response.createdAt),
          isAdmin: response.isAdmin || false
        }))
      : [],
    attachments: apiTicket.attachments || [],
    category: apiTicket.category || 'general'
  };
};

/**
 * Adaptador para lista de tickets
 * @param {Array|Object} apiResponse - Datos crudos de tickets desde la API o objeto paginado
 * @returns {Object} - Datos formateados para el frontend con paginación si existe
 */
export const ticketsAdapter = (apiResponse = []) => {
  console.log('ticketsAdapter recibió:', apiResponse);

  // CASO ESPECÍFICO: para la estructura exacta que tenemos en la API
  // data: Array(2), current_page: 1, page_records: 2, total_records: 2
  if (
    apiResponse &&
    apiResponse.data &&
    Array.isArray(apiResponse.data) &&
    typeof apiResponse.current_page === 'number' &&
    typeof apiResponse.page_records === 'number' &&
    typeof apiResponse.total_records === 'number'
  ) {
    console.log(
      'FORMATO DETECTADO: API Play Attention',
      apiResponse.data.length
    );

    // Adaptar cada ticket en el array de datos
    const adaptedTickets = apiResponse.data.map(ticket =>
      ticketAdapter(ticket)
    );
    console.log('Tickets adaptados:', adaptedTickets.length, adaptedTickets);

    // Devolver objeto estructurado con paginación
    return {
      tickets: adaptedTickets,
      total: apiResponse.total_records,
      totalPages:
        Math.ceil(apiResponse.total_records / apiResponse.page_records) || 1,
      page: apiResponse.current_page,
      limit: apiResponse.page_records
    };
  }

  // Caso específico para la estructura "data, current_page, page_records, total_records"
  if (
    apiResponse &&
    apiResponse.data &&
    Array.isArray(apiResponse.data) &&
    'current_page' in apiResponse &&
    'page_records' in apiResponse &&
    'total_records' in apiResponse
  ) {
    console.log('Procesando formato específico con data y current_page');
    const adaptedTickets = apiResponse.data.map(ticket =>
      ticketAdapter(ticket)
    );

    return {
      tickets: adaptedTickets,
      total:
        apiResponse.total_records ||
        apiResponse.page_records ||
        adaptedTickets.length,
      page: apiResponse.current_page || 1,
      limit: apiResponse.page_records || adaptedTickets.length,
      totalPages:
        apiResponse.last_page ||
        Math.ceil(
          (apiResponse.total_records || adaptedTickets.length) /
            (apiResponse.page_records || 10)
        )
    };
  }

  // Si la respuesta es un objeto con estructura de paginación
  if (apiResponse && !Array.isArray(apiResponse) && apiResponse.data) {
    console.log('Procesando formato con data en objeto');
    const { data, total, page, limit, totalPages } = apiResponse;

    // Adaptar cada ticket en el array de datos
    const adaptedTickets = Array.isArray(data)
      ? data.map(ticket => ticketAdapter(ticket))
      : [];

    // Devolver objeto estructurado con paginación
    return {
      tickets: adaptedTickets,
      total: total || adaptedTickets.length,
      page: page || 1,
      limit: limit || 10,
      totalPages: totalPages || 1
    };
  }

  // Si la respuesta tiene la estructura con array de "data" dentro de un objeto
  if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
    console.log('Procesando formato con data en array');
    const adaptedTickets = apiResponse.data.map(ticket =>
      ticketAdapter(ticket)
    );
    return {
      tickets: adaptedTickets,
      total: apiResponse.totalTickets || adaptedTickets.length,
      page: apiResponse.currentPage || 1,
      limit: apiResponse.limit || adaptedTickets.length,
      totalPages: apiResponse.totalPages || 1
    };
  }

  // Si la respuesta es simplemente un array de tickets (formato antiguo)
  if (Array.isArray(apiResponse)) {
    console.log('Procesando array simple');
    const adaptedTickets = apiResponse.map(ticket => ticketAdapter(ticket));
    return {
      tickets: adaptedTickets,
      total: adaptedTickets.length,
      page: 1,
      limit: adaptedTickets.length,
      totalPages: 1
    };
  }

  // Manejar el caso donde la estructura tiene un array en "tickets" (como en tu captura)
  if (
    apiResponse &&
    apiResponse.tickets &&
    Array.isArray(apiResponse.tickets)
  ) {
    console.log('Procesando formato con tickets en array');
    const adaptedTickets = apiResponse.tickets.map(ticket =>
      ticketAdapter(ticket)
    );
    return {
      tickets: adaptedTickets,
      total: apiResponse.totalTickets || adaptedTickets.length,
      page: apiResponse.currentPage || 1,
      limit: apiResponse.limit || adaptedTickets.length,
      totalPages: apiResponse.totalPages || 1
    };
  }

  // Fallback para respuestas imprevistas
  console.error(
    'Error: ticketsAdapter esperaba un array o un objeto paginado pero recibió:',
    apiResponse
  );

  return {
    tickets: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  };
};
