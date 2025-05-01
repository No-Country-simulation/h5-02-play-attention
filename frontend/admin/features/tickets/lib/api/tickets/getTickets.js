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
 * @returns {Promise<Object>} - Tickets y metadatos de paginación
 */
export async function getTickets() {
  try {
    // URL para obtener todos los tickets sin filtros
    const url = `${API_URL}/support-tickets`;

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
