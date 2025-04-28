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
 * @param {string} id Id del contenido a actualizar
 * @param {Object} formData Datos del formulario de contenido
 * @returns {Promise<Object>} Contenido actualizado
 */
export async function updateContent(id, formData) {
  try {
    // Validación para garantizar que todos los campos requeridos están presentes
    if (!formData.title || !formData.type || !formData.categoryId) {
      throw new Error('Faltan campos obligatorios: título, tipo o categoría');
    }

    // Si hay un archivo adjunto, debemos usar FormData
    if (formData.file && formData.file instanceof File) {
      const formDataObj = new FormData();

      // Añadir todos los campos de texto
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.content || '');
      formDataObj.append('type', mapContentTypeToBackend(formData.type));
      formDataObj.append('category', formData.categoryId);
      formDataObj.append('published', formData.status === 'Publicado');

      if (formData.youtubeId) {
        formDataObj.append('youtubeId', formData.youtubeId);
      }

      // Añadir el archivo
      formDataObj.append('file', formData.file);

      console.log('Enviando formulario con archivo al backend');

      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json'
        },
        body: formDataObj,
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorMessage = await handleResponseError(response);
        throw new Error(`Error al actualizar contenido: ${errorMessage}`);
      }

      const data = await response.json();
      console.log('Contenido actualizado:', data);
      return data;
    }

    // Si no hay archivo, usamos JSON normal como antes
    const payload = {
      title: formData.title,
      description: formData.content || '',
      type: mapContentTypeToBackend(formData.type),
      category: formData.categoryId,
      published: formData.status === 'Publicado',
      youtubeId: formData.youtubeId || null,
      url: formData.url || null // Incluir URL si existe
    };

    // Log para depuración
    console.log('Enviando payload al backend:', JSON.stringify(payload));

    const response = await fetch(`${API_URL}/resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorMessage = await handleResponseError(response);
      throw new Error(`Error al actualizar contenido: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Contenido actualizado:', data);
    return data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}
