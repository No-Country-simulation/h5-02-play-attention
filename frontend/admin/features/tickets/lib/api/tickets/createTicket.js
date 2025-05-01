/**
 * API para crear un nuevo ticket de soporte
 * Implementa la operación POST a la API de tickets
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToBackend,
  mapTicketPriority,
  handleResponseError
} from '../config';

/**
 * Crea un nuevo ticket de soporte
 * @param {Object} ticketData - Datos del nuevo ticket
 * @param {string} ticketData.title - Título del ticket
 * @param {string} ticketData.description - Descripción detallada del problema
 * @param {string} ticketData.status - Estado del ticket (abierto, en proceso, etc.)
 * @param {string} ticketData.priority - Prioridad del ticket (alta, media, baja)
 * @param {string} ticketData.userId - ID del usuario que creó el ticket
 * @returns {Promise<Object>} - El ticket creado
 */
export async function createTicket(ticketData) {
  try {
    // Validar campos requeridos
    if (!ticketData.title) {
      throw new Error('El título del ticket es obligatorio');
    }

    if (!ticketData.description) {
      throw new Error('La descripción del ticket es obligatoria');
    }

    // Preparar datos para el backend
    const mappedData = {
      ...ticketData,
      status: ticketData.status
        ? mapTicketStatusToBackend(ticketData.status)
        : 'open'
    };

    // Asegurar que priority sea uno de los valores aceptados por el backend
    if (ticketData.priority) {
      // El backend espera: low, medium, high, critical
      const priority = ticketData.priority.toLowerCase();

      // Si ya es un valor válido en inglés, usarlo directamente
      if (['low', 'medium', 'high', 'critical'].includes(priority)) {
        mappedData.priority = priority;
      } else {
        // Si está en español, mapearlo
        const priorityMap = {
          baja: 'low',
          media: 'medium',
          alta: 'high',
          crítica: 'critical'
        };
        mappedData.priority = priorityMap[priority] || 'medium';
      }
    } else {
      mappedData.priority = 'medium';
    }

    // Log para depuración
    console.log('Prioridad final enviada:', mappedData.priority);

    // Obtener el token de la cookie
    let token = null;
    try {
      const tokenCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='));

      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
        console.log('Token obtenido de cookie:', token);
      } else {
        console.warn('⚠️ No se encontró la cookie auth_token');
      }
    } catch (error) {
      console.error('Error al leer cookie auth_token:', error);
    }

    // Crear headers con el token de autorización
    const headers = {
      ...commonHeaders
    };

    // Agregar el token al header Authorization si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      // También probar con el formato que usa Swagger
      // headers['PlayAttentionToken'] = `Bearer ${token}`;
    }

    console.log('📨 Headers enviados:', JSON.stringify(headers));

    // Endpoint para la creación de tickets
    const endpoint = '/support-tickets/admin';
    const fullUrl = `${API_URL}${endpoint}`;
    console.log('🌐 URL completa de la API:', fullUrl);
    console.log('📦 Datos enviados:', JSON.stringify(mappedData));

    // Realizar la petición
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      credentials: 'include', // Enviar cookies
      body: JSON.stringify(mappedData)
    });

    // Verificar la respuesta
    console.log(
      '📡 Estado de la respuesta:',
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      console.error('Error detallado:', errorText);
      throw new Error(errorText);
    }

    const newTicket = await response.json();
    return newTicket;
  } catch (error) {
    console.error('Error al crear ticket:', error);
    throw new Error(`Error al crear ticket: ${error.message}`);
  }
}
