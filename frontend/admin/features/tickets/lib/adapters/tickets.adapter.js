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
    subject: apiTicket.subject || 'Sin asunto',
    content: apiTicket.content || apiTicket.message || '',
    user:
      typeof apiTicket.user === 'object'
        ? apiTicket.user.name || apiTicket.user.email || 'Usuario desconocido'
        : apiTicket.user || 'Usuario desconocido',
    userId:
      typeof apiTicket.user === 'object'
        ? apiTicket.user._id || apiTicket.user.id || ''
        : apiTicket.userId || '',
    status: mapTicketStatusToFrontend(apiTicket.status),
    priority: mapTicketPriority(apiTicket.priority || 'media'),
    date: formatDate(apiTicket.createdAt),
    updated: formatDate(apiTicket.updatedAt),
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
    attachments: apiTicket.attachments || []
  };
};

/**
 * Adaptador para lista de tickets
 * @param {Array|Object} apiResponse - Datos crudos de tickets desde la API o objeto paginado
 * @returns {Object} - Datos formateados para el frontend con paginación si existe
 */
export const ticketsAdapter = (apiResponse = []) => {
  // Si la respuesta es un objeto con estructura de paginación
  if (apiResponse && !Array.isArray(apiResponse) && apiResponse.data) {
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

  // Si la respuesta es simplemente un array de tickets (formato antiguo)
  if (Array.isArray(apiResponse)) {
    const adaptedTickets = apiResponse.map(ticket => ticketAdapter(ticket));
    return {
      tickets: adaptedTickets,
      total: adaptedTickets.length,
      page: 1,
      limit: adaptedTickets.length,
      totalPages: 1
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
