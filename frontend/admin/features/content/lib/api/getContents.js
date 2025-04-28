/**
 * Servicio para obtener todos los contenidos
 * Sigue el principio SRP al encargarse únicamente de obtener la lista de contenidos
 */

import { API_URL, commonHeaders } from './config';

/**
 * Obtiene todos los contenidos disponibles
 * @returns {Promise<Array>} Lista de contenidos
 */
export async function getContents() {
  try {
    const response = await fetch(`${API_URL}/resources`, {
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

    // La API devuelve {resources: [...]} pero necesitamos el array directamente
    console.log('Respuesta API:', data);
    return data.resources || [];
  } catch (error) {
    console.error('Error fetching contents:', error);
    throw error;
  }
}
