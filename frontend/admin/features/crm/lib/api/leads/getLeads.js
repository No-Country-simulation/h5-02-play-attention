/**
 * Servicio para obtener leads
 * Sigue el principio SRP al encargarse únicamente de obtener todos los leads
 */

import { API_URL, commonHeaders } from './config';

/**
 * Obtiene todos los leads
 * @returns {Promise<Array>} Lista de leads
 */
export async function getLeads() {
  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'GET',
      headers: commonHeaders,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
