/**
 * Servicio para obtener todos los mensajes de soporte
 * Sigue el principio SRP al encargarse únicamente de obtener la lista de tickets
 */

import { API_URL, commonHeaders, handleResponseError } from './config';

/**
 * Obtiene todos los tickets de soporte disponibles
 * @param {Object} filters - Filtros opcionales para la búsqueda
 * @returns {Promise<Object>} Objeto con tickets y metadatos de paginación
 */
export async function getTickets(filters = {}) {
  try {
    // Construir los parámetros de consulta si hay filtros
    let queryParams = '';
    if (Object.keys(filters).length) {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      queryParams = `?${params.toString()}`;
    }

    const response = await fetch(`${API_URL}/support-messages${queryParams}`, {
      method: 'GET',
      headers: commonHeaders,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    const data = await response.json();

    // Procesar la respuesta
    console.log('Tickets recibidos de API:', data);

    // Si la API ya devuelve un formato paginado (data, total, etc.)
    if (data && typeof data === 'object' && data.data) {
      return data;
    }

    // Si la API aún devuelve solo un array, crear estructura paginada
    if (Array.isArray(data)) {
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10; // Fuerzo a 10 para tener paginación

      // Simulamos paginación de manera forzada para tener siempre múltiples páginas
      // Esto es temporal para propósitos de desarrollo/demo
      const totalItems = Math.max(data.length, limit * 3); // Al menos 3 páginas
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedData = data.slice(
        startIndex,
        Math.min(endIndex, data.length)
      );

      return {
        data: paginatedData,
        total: totalItems,
        page,
        limit,
        totalPages: Math.max(Math.ceil(totalItems / limit), 3) // Al menos 3 páginas
      };
    }

    // Fallback
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    };
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
}
