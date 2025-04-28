/**
 * Servicio para actualizar un contenido existente
 * Sigue el principio SRP al encargarse únicamente de la actualización de contenido
 */

import {
  API_URL,
  mapContentTypeToBackend,
  handleResponseError
} from './config';

/**
 * Actualiza un contenido existente
 * @param {string} id ID del contenido a actualizar
 * @param {Object} formData Datos actualizados del contenido
 * @returns {Promise<Object>} Contenido actualizado
 */
export async function updateContent(id, formData) {
  try {
    // Validación estricta del ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`ID del contenido inválido: "${id}"`);
    }

    // Validación para garantizar que todos los campos requeridos están presentes
    if (!formData.title || !formData.type || !formData.category) {
      throw new Error('Faltan campos obligatorios: título, tipo o categoría');
    }

    // Transformar los datos al formato exacto que espera el backend
    const payload = {
      title: formData.title,
      description: formData.content || '',
      type: mapContentTypeToBackend(formData.type),
      category: formData.category,
      published: formData.status === 'Publicado',
      youtubeId: formData.youtubeId || null
    };

    // Si hay un archivo, necesitamos usar FormData para envío multipart
    if (formData.file) {
      const multipartData = new FormData();

      // Agregar el archivo
      multipartData.append('file', formData.file);

      // Agregar los datos del contenido como JSON string
      multipartData.append('data', JSON.stringify(payload));

      const response = await fetch(`${API_URL}/resources/${id}/upload`, {
        method: 'PUT',
        body: multipartData
      });

      if (!response.ok) {
        const errorText = await handleResponseError(response);
        throw new Error(errorText);
      }

      return response.json();
    } else {
      // Si no hay archivo, hacemos una petición JSON normal
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await handleResponseError(response);
        throw new Error(errorText);
      }

      return response.json();
    }
  } catch (error) {
    console.error(`Error updating content with ID ${id}:`, error);
    throw error;
  }
}
