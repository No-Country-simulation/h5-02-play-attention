/**
 * Obtiene todos los tickets y filtra por usuario actual
 * @param {Object} params - Parámetros de búsqueda
 * @param {number} params.page - Número de página
 * @param {number} params.take - Elementos por página
 * @param {string} params.category - Filtro por categoría
 * @param {string} params.priority - Filtro por prioridad
 * @param {string} params.status - Filtro por estado
 * @param {string} params.sort_by - Campo para ordenar
 * @param {string} params.order - Orden (asc/desc)
 * @returns {Promise<Object>} Lista de tickets y metadata
 */
import { getUserInfoFromCookie } from '../../utils/cookies';
import { ENDPOINTS, buildUrl, getAuthHeaders } from '../../config/api';

export const getTickets = async (params = {}) => {
  // Establecer un valor predeterminado alto para la cantidad de tickets (500)
  const defaultParams = {
    take: 500,
    ...params
  };

  // Construir URL con los parámetros utilizando la función buildUrl
  const url = buildUrl(ENDPOINTS.SUPPORT_TICKETS, defaultParams);

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  // Hacer la petición a la API
  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener tickets');
  }

  const data = await response.json();

  // Depuración: ver datos recibidos
  console.log('Tickets recibidos del servidor:', data);

  // Obtener el ID del usuario actual desde las cookies
  const userInfoCookie = getUserInfoFromCookie();
  console.log('Usuario actual:', userInfoCookie);

  // Filtrar tickets por usuario actual
  if (userInfoCookie && userInfoCookie.id) {
    console.log('Filtrando tickets para el usuario:', userInfoCookie.id);

    // Filtramos los tickets donde el creador sea el usuario actual
    const filteredTickets = data.data.filter(ticket => {
      const isCreatedByUser =
        (ticket.created_by && ticket.created_by === userInfoCookie.id) ||
        (ticket.created_by &&
          typeof ticket.created_by === 'object' &&
          ticket.created_by.id === userInfoCookie.id);

      const isAssignedToUser =
        (ticket.user_id && ticket.user_id === userInfoCookie.id) ||
        (ticket.assigned_to &&
          typeof ticket.assigned_to === 'object' &&
          ticket.assigned_to.id === userInfoCookie.id);

      const shouldInclude = isCreatedByUser || isAssignedToUser;

      if (shouldInclude) {
        console.log('Incluyendo ticket:', ticket.id, ticket.title);
      }

      return shouldInclude;
    });

    console.log('Tickets filtrados:', filteredTickets.length);

    return {
      data: filteredTickets,
      meta: {
        ...data.meta,
        total: filteredTickets.length
      }
    };
  }

  return data;
};
