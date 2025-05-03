/**
 * Servicio para eliminar un lead
 * Sigue el principio SRP al encargarse únicamente de la eliminación de leads
 */

import { API_URL, handleResponseError } from './config';

/**
 * Elimina un lead
 * @param {string} id ID del lead a eliminar
 * @returns {Promise<Object>} Confirmación
 */
export async function deleteLead(id) {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
