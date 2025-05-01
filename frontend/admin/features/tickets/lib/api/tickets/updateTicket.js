/**
 * API para actualizar un ticket de soporte existente
 * Implementa la operación PUT a la API de tickets
 */

import {
  API_URL,
  commonHeaders,
  mapTicketStatusToBackend,
  mapTicketPriority,
  handleResponseError
} from '../config';
import { AuthService } from '@/shared/lib/services/auth-service';

/**
 * Función para intentar extraer el token de las cookies
 * @returns {string|null} Token extraído o null si no se encuentra
 */
function getTokenFromCookies() {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  let token = null;

  // Buscar en auth_token, playAttentionToken y user_info
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token' || name === 'playAttentionToken') {
      token = decodeURIComponent(value);
      console.log(`[DEBUG] Token encontrado en cookie ${name}`);
      break;
    }

    // Intentar extraer de user_info si existe
    if (name === 'user_info') {
      try {
        const userInfo = JSON.parse(decodeURIComponent(value));
        if (userInfo && userInfo.token) {
          token = userInfo.token;
          console.log('[DEBUG] Token encontrado en cookie user_info');
          break;
        }
      } catch (e) {
        console.error('[ERROR] Error al parsear cookie user_info:', e);
      }
    }
  }

  return token;
}

/**
 * Actualiza un ticket de soporte existente
 * @param {string} ticketId - ID del ticket a actualizar
 * @param {Object} ticketData - Datos actualizados del ticket
 * @param {string} ticketData.title - Título actualizado del ticket
 * @param {string} ticketData.description - Descripción actualizada del ticket
 * @param {string} ticketData.status - Estado actualizado del ticket
 * @param {string} ticketData.priority - Prioridad actualizada del ticket
 * @returns {Promise<Object>} - El ticket actualizado
 */
export async function updateTicket(ticketId, ticketData) {
  if (!ticketId) {
    throw new Error('ID de ticket no proporcionado');
  }

  try {
    // Preparar datos para el backend
    const mappedData = { ...ticketData };

    // Mapear el estado si existe
    if (ticketData.status) {
      const originalStatus = ticketData.status;
      mappedData.status = mapTicketStatusToBackend(ticketData.status);
      console.log(
        `[DEBUG] Estado de ticket mapeado: "${originalStatus}" -> "${mappedData.status}"`
      );
    }

    // Mapear la prioridad si existe
    if (ticketData.priority) {
      mappedData.priority = mapTicketPriority(ticketData.priority);
    }

    // Preparar los headers con autenticación
    const headersWithAuth = { ...commonHeaders };

    // Intentar obtener el token de múltiples fuentes
    let token = null;

    // 1. Intentar con AuthService
    try {
      token = AuthService.getToken();
      if (token) {
        console.log('[DEBUG] Token obtenido de AuthService');
      }
    } catch (e) {
      console.warn('[WARN] Error al obtener token de AuthService:', e);
    }

    // 2. Si no se encontró, intentar extraerlo de cookies
    if (!token) {
      token = getTokenFromCookies();
      if (token) {
        console.log('[DEBUG] Token obtenido de cookies');
      }
    }

    // Añadir el header de Authorization si se encontró un token
    if (token) {
      headersWithAuth.Authorization = `Bearer ${token}`;
      console.log('[DEBUG] Header de Authorization añadido a la petición');
    } else {
      console.warn(
        '[WARN] No se encontró ningún token. La petición puede fallar con 401.'
      );
    }

    console.log(
      `[DEBUG] Actualizando ticket ${ticketId} con datos:`,
      mappedData
    );
    console.log(
      '[DEBUG] Headers de la petición:',
      Object.keys(headersWithAuth)
    );

    // Realizar la petición combinando ambos enfoques
    const response = await fetch(`${API_URL}/support-tickets/${ticketId}`, {
      method: 'PUT',
      headers: headersWithAuth,
      credentials: 'include', // Mantener las cookies
      body: JSON.stringify(mappedData)
    });

    if (!response.ok) {
      const errorDetails = await handleResponseError(response);
      console.error(
        `[ERROR] Fallo al actualizar ticket ${ticketId} (${response.status}):`,
        errorDetails
      );
      throw new Error(errorDetails);
    }

    const updatedTicket = await response.json();
    console.log(
      `[DEBUG] Ticket ${ticketId} actualizado correctamente:`,
      updatedTicket
    );
    return updatedTicket;
  } catch (error) {
    console.error(`[ERROR] Error al actualizar ticket ${ticketId}:`, error);
    throw new Error(`Error al actualizar ticket: ${error.message}`);
  }
}
