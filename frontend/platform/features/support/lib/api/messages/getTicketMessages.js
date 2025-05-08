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

    // Si el error es 404 (no encontrado) o un error específico de "no hay mensajes",
    // retornar un array vacío en lugar de lanzar un error
    if (response.status === 404) {
      console.log('No se encontraron mensajes para este ticket (404)');
      return { data: [] };
    }

    if (!response.ok) {
      const error = await response.json();
      console.error('Error completo del servidor:', error);

      // Si el mensaje de error indica que no hay mensajes, retornar un array vacío
      if (
        error.message?.includes('no hay mensajes') ||
        error.message?.toLowerCase().includes('no messages')
      ) {
        console.log(
          'No hay mensajes para este ticket según el servidor:',
          error.message
        );
        return { data: [] };
      }

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
