/**
 * Servicio para actualizar una categoría existente
 * Sigue el principio SRP al encargarse únicamente de la actualización de categorías
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Actualiza una categoría existente
 * @param {string} id ID de la categoría a actualizar
 * @param {Object} formData Datos actualizados de la categoría
 * @returns {Promise<Object>} Categoría actualizada
 */
export async function updateCategory(id, formData) {
  try {
    // Validación estricta del ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`ID de categoría inválido: "${id}"`);
    }

    // Validación para garantizar que todos los campos requeridos están presentes
    if (!formData.name) {
      throw new Error('Falta el campo obligatorio: nombre');
    }

    // Transformar los datos al formato exacto que espera el backend
    const payload = {
      name: formData.name,
      description: formData.description || ''
      // No modificamos el array resources_id para no desasociar contenidos existentes
    };

    // Log para depuración
    console.log(`Actualizando categoría ${id} con:`, JSON.stringify(payload));

    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: commonHeaders,
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorMessage = await handleResponseError(response);
      throw new Error(`Error al actualizar categoría: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Categoría actualizada:', data);
    return data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
}
