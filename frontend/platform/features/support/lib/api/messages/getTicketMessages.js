/**
 * Obtiene todos los mensajes de un ticket específico
 * @param {string} ticketId - ID del ticket
 * @returns {Promise<Array>} Lista de mensajes
 */
import { ENDPOINTS, getAuthHeaders } from '../../config/api';

export const getTicketMessages = async ticketId => {
  if (!ticketId) throw new Error('ID de ticket requerido');

  // Obtener los headers actualizados con el token
  const headers = getAuthHeaders();

  // Asegurarnos de usar el formato de URL correcto de acuerdo a la API
  const url = `${ENDPOINTS.SUPPORT_MESSAGES}/${ticketId}`;
  console.log('Solicitando mensajes de ticket:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error completo del servidor:', error);
      throw new Error(
        error.message || 'Error al obtener los mensajes del ticket'
      );
    }

    // La API puede devolver un array o un objeto con data
    const result = await response.json();

    // Para depuración
    console.log('Respuesta de mensajes del ticket:', result);

    // Manejar tanto si la respuesta es un objeto con data o directamente un array
    return Array.isArray(result) ? { data: result } : result;
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    throw error;
  }
};
