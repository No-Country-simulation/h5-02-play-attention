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
    if (
      !formData.title ||
      !formData.type ||
      !formData.categoryId ||
      !formData.description
    ) {
      throw new Error(
        'Faltan campos obligatorios: título, tipo, categoría o descripción'
      );
    }

    // Validar que no se envíen archivo y URL simultáneamente
    if (formData.file && formData.url) {
      throw new Error(
        'No se puede enviar un archivo y una URL al mismo tiempo'
      );
    }

    // Si hay un archivo adjunto, debemos usar FormData
    if (formData.file && formData.file instanceof File) {
      const formDataObj = new FormData();

      // Añadir todos los campos de texto
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('type', mapContentTypeToBackend(formData.type));
      formDataObj.append('category', formData.categoryId);
      formDataObj.append('published', false); // Siempre false (borrador) por defecto
      formDataObj.append('url', ''); // URL vacía cuando hay archivo
      formDataObj.append('youtubeId', ''); // youtubeId vacío cuando hay archivo

      // Añadir el archivo
      formDataObj.append('file', formData.file);

      console.log('Enviando formulario con archivo al backend');

      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formDataObj,
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorMessage = await handleResponseError(response);
        throw new Error(`Error al crear contenido: ${errorMessage}`);
      }

      const data = await response.json();
      console.log('Contenido creado:', data);
      return data;
    }

    // Si no hay archivo pero hay URL, o no hay ninguno de los dos
    const payload = {
      title: formData.title,
      description: formData.description,
      type: mapContentTypeToBackend(formData.type),
      category: formData.categoryId,
      published: false, // Siempre false (borrador) por defecto
      youtubeId: formData.youtubeId || '',
      url: formData.youtubeId
        ? `https://www.youtube.com/watch?v=${formData.youtubeId}`
        : formData.url || '', // URL de YouTube o URL proporcionada
      file: null // Siempre null cuando se envía URL
    };

    // Log para depuración
    console.log('Enviando payload al backend:', JSON.stringify(payload));

    const response = await fetch(`${API_URL}/resources`, {
      method: 'POST',
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
      throw new Error(`Error al crear contenido: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Contenido creado:', data);
    return data;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
}
