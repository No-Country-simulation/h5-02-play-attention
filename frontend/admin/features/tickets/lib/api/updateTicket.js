/**
 * Servicio para actualizar un mensaje de soporte existente
 * Sigue el principio SRP al encargarse únicamente de actualizar un ticket
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToBackend,
  mapTicketPriority,
  handleResponseError
} from './config';

/**
 * Actualiza un ticket de soporte existente
 * @param {string} id - ID del ticket a actualizar
 * @param {Object} ticketData - Datos actualizados del ticket
 * @returns {Promise<Object>} Ticket actualizado
 */
export async function updateTicket(id, ticketData) {
  if (!id) {
    throw new Error('Se requiere ID para actualizar el ticket');
  }

  if (!ticketData) {
    throw new Error('Se requieren datos para actualizar el ticket');
  }

  try {
    // Preparar el objeto de datos para la API
    const payload = {};

    // Solo incluir los campos que se están actualizando
    if (ticketData.subject !== undefined) payload.subject = ticketData.subject;
    if (ticketData.content !== undefined) payload.content = ticketData.content;
    if (ticketData.message !== undefined) payload.content = ticketData.message;
    if (ticketData.status !== undefined)
      payload.status = mapTicketStatusToBackend(ticketData.status);
    if (ticketData.priority !== undefined)
      payload.priority = mapTicketPriority(ticketData.priority);

    // Incluir respuestas si se proporcionan
    if (ticketData.response) payload.response = ticketData.response;

    // Incluir archivos adjuntos si se proporcionan
    if (ticketData.attachments) payload.attachments = ticketData.attachments;

    console.log(`Actualizando ticket ${id} con datos:`, payload);

    const response = await fetch(`${API_URL}/support-messages/${id}`, {
      method: 'PUT',
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
    console.log(`Ticket ${id} actualizado:`, data);
    return data;
  } catch (error) {
    console.error(`Error updating ticket with id ${id}:`, error);
    throw error;
  }
}
