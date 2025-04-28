/**
 * Adaptador para contenidos
 * Convierte los datos de contenidos de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

import { mapContentTypeToFrontend } from '../api/config';

/**
 * Adaptador para un único contenido
 * @param {Object} apiContent - Datos crudos de contenido desde la API
 * @returns {Object} - Datos formateados para el frontend
 */
export const contentAdapter = (apiContent = {}) => {
  if (!apiContent) return null;

  console.log('Adaptando contenido individual:', apiContent);

  const adaptedContent = {
    id: apiContent._id || apiContent.id || '',
    title: apiContent.title || '',
    type: mapContentTypeToFrontend(apiContent.type || apiContent.contentType),
    content: apiContent.description || apiContent.content || '',
    category: apiContent.category || 'Otros',
    // Convertir boolean published a string de estado
    status: apiContent.published === true ? 'Publicado' : 'Borrador',
    youtubeId: apiContent.youtubeId || null,
    fileUrl: apiContent.fileUrl || apiContent.url || null,
    createdAt: apiContent.createdAt || new Date().toISOString(),
    updatedAt: apiContent.updatedAt || null,
    // Formato de fecha para UI
    date: apiContent.createdAt
      ? new Date(apiContent.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  };

  console.log('Contenido adaptado:', adaptedContent);
  return adaptedContent;
};

/**
 * Adaptador para lista de contenidos
 * @param {Array} apiContents - Datos crudos de contenidos desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const contentsAdapter = (apiContents = []) => {
  console.log('Adaptando lista de contenidos:', apiContents);

  if (!Array.isArray(apiContents)) {
    console.error(
      'Error: contentsAdapter esperaba un array pero recibió:',
      apiContents
    );
    return [];
  }

  if (!apiContents.length) {
    console.log('No hay contenidos para adaptar');
    return [];
  }

  const adaptedContents = apiContents.map(content => contentAdapter(content));
  console.log('Lista de contenidos adaptada:', adaptedContents);
  return adaptedContents;
};
