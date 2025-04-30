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
    console.log('Respuesta API:', data);

    // Asegurarnos de que data es un array o extraer el array de resources
    let contents = Array.isArray(data) ? data : data.resources;

    // Si aún no es un array, devolver array vacío
    if (!Array.isArray(contents)) {
      console.error(
        'Error: La respuesta no contiene un array de contenidos:',
        data
      );
      contents = [];
    }

    return contents;
  } catch (error) {
    console.error('Error fetching contents:', error);
    throw error;
  }
}
