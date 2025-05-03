/**
 * Servicio para obtener un lead por su ID
 * Sigue el principio SRP al encargarse únicamente de obtener un lead específico
 */

import { API_URL, commonHeaders } from './config';

/**
 * Obtiene un lead por su ID
 * @param {string} id ID del lead
 * @returns {Promise<Object>} Datos del lead
 */
export async function getLeadById(id) {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      headers: commonHeaders
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
