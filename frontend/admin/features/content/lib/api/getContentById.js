/**
 * Servicio para obtener un contenido específico por su ID
 * Sigue el principio SRP al encargarse únicamente de obtener un contenido
 */

import { API_URL, commonHeaders } from './config';

/**
 * Obtiene un contenido específico por su ID
 * @param {string} id ID del contenido
 * @returns {Promise<Object>} Datos del contenido
 */
export async function getContentById(id) {
  try {
    const response = await fetch(`${API_URL}/resources/${id}`, {
      headers: commonHeaders
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching content with ID ${id}:`, error);
    throw error;
  }
}
