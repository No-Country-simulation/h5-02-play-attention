/**
 * Servicio para obtener una categoría por su ID
 * Sigue el principio SRP al encargarse únicamente de obtener una categoría específica
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Obtiene una categoría por su ID
 * @param {string} id - ID de la categoría a obtener
 * @returns {Promise<Object>} Categoría encontrada
 */
export async function getCategoryById(id) {
  try {
    if (!id) {
      throw new Error('ID de categoría no proporcionado');
    }

    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'GET',
      headers: commonHeaders,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorMessage = await handleResponseError(response);
      throw new Error(`Error al obtener categoría: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
}
