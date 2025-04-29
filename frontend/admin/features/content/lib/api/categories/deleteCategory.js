/**
 * Servicio para eliminar una categoría
 * Sigue el principio SRP al encargarse únicamente de la eliminación de categorías
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Elimina una categoría por su ID
 * @param {string} id ID de la categoría a eliminar
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export async function deleteCategory(id) {
  try {
    // Validación estricta del ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`ID de categoría inválido: "${id}"`);
    }

    console.log(`Eliminando categoría con ID: ${id}`);

    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: commonHeaders,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorMessage = await handleResponseError(response);
      throw new Error(`Error al eliminar categoría: ${errorMessage}`);
    }

    // Algunos endpoints pueden devolver un cuerpo vacío al eliminar
    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      // Si no hay JSON, devolvemos un objeto de éxito genérico
      return { success: true, id };
    }
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
}
