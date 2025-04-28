/**
 * Servicio para obtener todas las categorías
 * Sigue el principio SRP al encargarse únicamente de obtener la lista de categorías
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Obtiene todas las categorías disponibles
 * @returns {Promise<Array>} Lista de categorías
 */
export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      headers: commonHeaders,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorMessage = await handleResponseError(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Devolvemos directamente el array de categorías (no viene en una propiedad específica como "resources")
    console.log('Respuesta API categorías:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
