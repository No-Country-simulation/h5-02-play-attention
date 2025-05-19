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
 * Obtiene la lista completa de tickets de soporte
 * @param {Object} options - Opciones de paginación y filtrado
 * @returns {Promise<Object>} - Tickets y metadatos de paginación
 */
export async function getTickets(options = {}) {
  try {
    // Configurar los parámetros por defecto
    const params = new URLSearchParams({
      take: options.limit || 500,
      page: options.page || 1
    });

    // Añadir filtros adicionales si existen
    if (options.status) {
      params.append('status', options.status);
    }

    if (options.priority) {
      params.append('priority', options.priority);
    }

    if (options.search) {
      params.append('search', options.search);
    }

    // Añadir parámetros de ordenación - solo usar los valores aceptados por la API
    // La API solo acepta: created_at, updated_at, priority, status, title
    if (options.sort_by) {
      params.append('sort_by', options.sort_by);
    }

    if (options.order) {
      params.append('order', options.order);
    }

    // Para debugging
    console.log('URL Params para tickets:', params.toString());

    // URL para obtener los tickets con parámetros
    const url = `${API_URL}/support-tickets?${params.toString()}`;

    // Realizar la petición
    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders
    });

    if (!response.ok) {
      throw new Error(await handleResponseError(response));
    }

    const data = await response.json();

    // Log para ver la estructura de la respuesta
    console.log('Respuesta API tickets:', {
      estructura: Object.keys(data),
      totalItems: data.data?.length || 0,
      primerItem: data.data?.[0] ? Object.keys(data.data[0]) : null
    });

    // No transformamos los datos aquí, devolvemos la respuesta tal cual para que el adaptador la procese
    return data;
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    throw new Error(`Error al obtener tickets: ${error.message}`);
  }
}
