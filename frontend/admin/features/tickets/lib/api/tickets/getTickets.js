/**
 * API para obtener todos los tickets de soporte
 * Implementa la consulta GET a la API de tickets
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToFrontend,
  handleResponseError
} from '../config';

/**
 * Obtiene la lista de tickets de soporte con filtros opcionales
 * @param {Object} filters - Filtros para la consulta
 * @param {string} filters.status - Filtrar por estado (abierto, en proceso, etc.)
 * @param {string} filters.query - Búsqueda de texto
 * @param {string} filters.dateFilter - Filtro de fecha
 * @param {number} filters.page - Página actual para paginación
 * @param {number} filters.limit - Límite de resultados por página
 * @returns {Promise<Object>} - Tickets y metadatos de paginación
 */
export async function getTickets(filters = {}) {
  try {
    // Construir los parámetros de consulta
    const queryParams = new URLSearchParams();

    if (filters.status) {
      queryParams.append('status', mapTicketStatusToFrontend(filters.status));
    }

    if (filters.query) {
      queryParams.append('query', filters.query);
    }

    if (filters.dateFilter) {
      queryParams.append('dateFilter', filters.dateFilter);
    }

    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }

    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    // Construir la URL con los parámetros
    const queryString = queryParams.toString();
    const url = `${API_URL}/support-tickets${
      queryString ? `?${queryString}` : ''
    }`;

    // Realizar la petición
    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const data = await response.json();

    // Transformar y devolver los datos
    return {
      tickets: data.tickets || [],
      total: data.totalTickets || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1
    };
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    throw new Error(`Error al obtener tickets: ${error.message}`);
  }
}
