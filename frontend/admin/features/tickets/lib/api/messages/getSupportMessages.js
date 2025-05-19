/**
 * API para obtener todos los mensajes de soporte
 * Implementa la consulta GET a la API de mensajes
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Obtiene todos los mensajes de soporte, opcionalmente filtrados
 * @param {Object} filters - Filtros para la consulta
 * @param {string} filters.ticketId - Filtrar mensajes por ID de ticket
 * @param {number} filters.page - Página actual para paginación
 * @param {number} filters.limit - Límite de resultados por página
 * @returns {Promise<Object>} - Mensajes y metadatos de paginación
 */
export async function getSupportMessages(filters = {}) {
  try {
    // Si tenemos un ticketId, usamos el endpoint específico para ese ticket
    if (filters.ticketId) {
      return await getTicketMessages(filters.ticketId);
    }

    // Si no hay ticketId, seguimos con la implementación general
    const queryParams = new URLSearchParams();

    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }

    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    // Construir la URL con los parámetros
    const queryString = queryParams.toString();
    const url = `${API_URL}/support-messages${
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
      messages: data.messages || [],
      total: data.totalMessages || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1
    };
  } catch (error) {
    console.error('Error al obtener mensajes de soporte:', error);
    throw new Error(`Error al obtener mensajes: ${error.message}`);
  }
}

/**
 * Obtiene los mensajes asociados a un ticket específico utilizando el endpoint directo
 * @param {string} ticketId - ID del ticket
 * @returns {Promise<Object>} - Mensajes del ticket
 */
async function getTicketMessages(ticketId) {
  try {
    if (!ticketId) {
      throw new Error('El ID del ticket es obligatorio');
    }

    const url = `${API_URL}/support-messages/${ticketId}`;

    console.log(`Obteniendo mensajes para el ticket ${ticketId} desde: ${url}`);

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
    console.log('Datos de mensajes recibidos:', data);

    // Comprobar si tenemos la estructura esperada de @messages en la respuesta
    if (data && data['@messages'] && Array.isArray(data['@messages'])) {
      return {
        messages: data['@messages'],
        total: data['@messages'].length,
        totalPages: 1,
        currentPage: 1
      };
    }

    // Formato alternativo por si la respuesta es diferente
    return {
      messages: Array.isArray(data) ? data : data.messages || [],
      total: Array.isArray(data)
        ? data.length
        : data.total || data.messages?.length || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1
    };
  } catch (error) {
    console.error(
      `Error al obtener mensajes para el ticket ${ticketId}:`,
      error
    );
    throw new Error(`Error al obtener mensajes del ticket: ${error.message}`);
  }
}
