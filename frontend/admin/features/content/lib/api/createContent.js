/**
 * Servicio para crear un nuevo contenido
 * Sigue el principio SRP al encargarse únicamente de la creación de contenido
 */

import {
  API_URL,
  mapContentTypeToBackend,
  handleResponseError
} from './config';

/**
 * Crea un nuevo contenido
 * @param {Object} formData Datos del formulario de contenido
 * @returns {Promise<Object>} Contenido creado
 */
export async function createContent(formData) {
  try {
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

    // Log para depuración
    console.log('Enviando payload al backend:', JSON.stringify(payload));

    // Si hay un archivo, necesitamos usar FormData para envío multipart
    if (formData.file) {
      const multipartData = new FormData();

      // Agregar el archivo
      multipartData.append('file', formData.file);

      // Agregar los datos del contenido como JSON string
      multipartData.append('data', JSON.stringify(payload));

      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        body: multipartData
      });

      if (!response.ok) {
        const errorText = await handleResponseError(response);
        throw new Error(errorText);
      }

      return response.json();
    } else {
      // Si no hay archivo, hacemos una petición JSON normal
      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
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
    console.error('Error creating content:', error);
    throw error;
  }
}
