/**
 * Servicio para crear un nuevo mensaje de soporte
 * Sigue el principio SRP al encargarse únicamente de crear un ticket
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToBackend,
  mapTicketPriority,
  handleResponseError
} from './config';

/**
 * Crea un nuevo ticket de soporte
 * @param {Object} ticketData - Datos del ticket a crear
 * @returns {Promise<Object>} Ticket creado
 */
export async function createTicket(ticketData) {
  if (!ticketData) {
    throw new Error('Se requieren datos para crear el ticket');
  }

  try {
    // Preparar el objeto de datos para la API
    const payload = {
      subject: ticketData.subject,
      content: ticketData.content || ticketData.message,
      userId: ticketData.userId,
      status: mapTicketStatusToBackend(ticketData.status || 'abierto'),
      priority: mapTicketPriority(ticketData.priority || 'media'),
      // Otros campos que puedan ser necesarios
      ...(ticketData.attachments && { attachments: ticketData.attachments })
    };

    console.log('Enviando ticket a la API:', payload);

    const response = await fetch(`${API_URL}/support-messages`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log('Ticket creado en API:', data);
    return data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
}
