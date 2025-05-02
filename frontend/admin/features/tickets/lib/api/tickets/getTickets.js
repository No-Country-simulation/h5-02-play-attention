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

    // No transformamos los datos aquí, devolvemos la respuesta tal cual para que el adaptador la procese
    return data;
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    throw new Error(`Error al obtener tickets: ${error.message}`);
  }
}
