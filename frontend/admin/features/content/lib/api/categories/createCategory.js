/**
 * Servicio para crear una nueva categoría
 * Sigue el principio SRP al encargarse únicamente de la creación de categorías
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Crea una nueva categoría
 * @param {Object} formData Datos del formulario de categoría
 * @returns {Promise<Object>} Categoría creada
 */
export async function createCategory(formData) {
  try {
    // Validación para garantizar que todos los campos requeridos están presentes
    if (!formData.name) {
      throw new Error('Falta el campo obligatorio: nombre');
    }

    // Transformar los datos al formato exacto que espera el backend
    const payload = {
      name: formData.name,
      description: formData.description || '',
      resources_id: [] // Inicialmente sin recursos asociados
    };

    // Log para depuración
    console.log('Enviando payload al backend:', JSON.stringify(payload));

    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorMessage = await handleResponseError(response);
      throw new Error(`Error al crear categoría: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Categoría creada:', data);
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}
