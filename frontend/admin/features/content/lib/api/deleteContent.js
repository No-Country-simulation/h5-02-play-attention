/**
 * Servicio para eliminar un contenido
 * Sigue el principio SRP al encargarse únicamente de la eliminación de contenido
 */

import { API_URL, handleResponseError } from './config';

/**
 * Elimina un contenido
 * @param {string} id ID del contenido a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function deleteContent(id) {
  try {
    // Validación estricta del ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`ID del contenido inválido: "${id}"`);
    }

    const response = await fetch(`${API_URL}/resources/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    return response.json();
  } catch (error) {
    console.error(`Error deleting content with ID ${id}:`, error);
    throw error;
  }
}
