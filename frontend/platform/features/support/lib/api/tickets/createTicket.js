/**
 * Crea un nuevo ticket de soporte
 * @param {Object} ticketData - Datos del ticket a crear
 * @param {string} ticketData.title - Título del ticket
 * @param {string} ticketData.description - Descripción del problema
 * @param {string} ticketData.category - Categoría del ticket (bug, feature_request, billing, technical)
 * @returns {Promise<Object>} Ticket creado
 */
import { ENDPOINTS, getAuthHeaders } from '../../config/api';

export const createTicket = async ticketData => {
  // Validar campos requeridos
  if (!ticketData.title || !ticketData.description) {
    throw new Error('Título y descripción son requeridos');
  }

  // Validar que la categoría sea válida
  const validCategories = ['bug', 'feature_request', 'billing', 'technical'];
  if (ticketData.category && !validCategories.includes(ticketData.category)) {
    throw new Error(
      'Categoría no válida. Debe ser: bug, feature_request, billing o technical'
    );
  }

  // Asegurar que se envíe el campo correcto al API (title)
  const apiData = {
    ...ticketData
  };

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  const response = await fetch(`${ENDPOINTS.SUPPORT_TICKETS}/platform`, {
    method: 'POST',
    headers,
    body: JSON.stringify(apiData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el ticket');
  }

  return response.json();
};
