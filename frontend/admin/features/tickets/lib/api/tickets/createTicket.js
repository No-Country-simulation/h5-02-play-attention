/**
 * API para crear un nuevo ticket de soporte
 * Implementa la operación POST a la API de tickets
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToBackend,
  mapTicketPriority,
  handleResponseError,
  validateTicketOrigin
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
    console.log('DATOS ORIGINALES DEL TICKET:', ticketData);

    // Validar campos requeridos
    if (!ticketData.title) {
      throw new Error('El título del ticket es obligatorio');
    }

    if (!ticketData.description) {
      throw new Error('La descripción del ticket es obligatoria');
    }

    // Validar ticket_origin - esta es la parte crítica
    // Usar la función específica de validación para asegurar valores exactos
    const validatedTicketOrigin = validateTicketOrigin(
      ticketData.ticket_origin
    );

    // Crear copia limpia de los datos para evitar mutar el objeto original
    const ticketDataCopy = { ...ticketData };

    // Asignar el valor validado
    ticketDataCopy.ticket_origin = validatedTicketOrigin;

    console.log(`Ticket origin validado: "${validatedTicketOrigin}"`);

    // Preparar datos para el backend
    const mappedData = {
      ...ticketDataCopy,
      status: ticketDataCopy.status
        ? mapTicketStatusToBackend(ticketDataCopy.status)
        : 'open'
    };

    // Asegurar que priority sea uno de los valores aceptados por el backend
    if (ticketDataCopy.priority) {
      // El backend espera: low, medium, high, critical
      const priority = ticketDataCopy.priority.toLowerCase();

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

  

    // Verificar ID de usuario asignado
    if (mappedData.assigned_to) {
      console.log('Usuario asignado:', mappedData.assigned_to);
    } else {
      console.warn('No se asignó el ticket a ningún usuario');
    }

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
    }

    console.log('📨 Headers enviados:', JSON.stringify(headers));

    // Endpoint para la creación de tickets
    const endpoint = '/support-tickets/admin';
    const fullUrl = `${API_URL}${endpoint}`;
    console.log('🌐 URL completa de la API:', fullUrl);
    console.log('📦 Datos finales enviados:', JSON.stringify(mappedData));

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

    // Si el servidor responde con un error, intentar leer el cuerpo de la respuesta
    if (!response.ok) {
      const errorText = await handleResponseError(response);
      console.error('Error detallado:', errorText);

      // Intentar parsear el cuerpo de error si es JSON
      try {
        const errorBody = await response.text();
        console.error('Cuerpo de la respuesta de error:', errorBody);
      } catch (e) {
        console.error('No se pudo leer el cuerpo de la respuesta:', e);
      }

      throw new Error(errorText);
    }

    const newTicket = await response.json();
    console.log('Ticket creado exitosamente:', newTicket);
    return newTicket;
  } catch (error) {
    console.error('Error al crear ticket:', error);
    throw new Error(`Error al crear ticket: ${error.message}`);
  }
}
