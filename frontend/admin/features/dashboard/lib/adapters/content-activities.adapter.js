/**
 * Adaptador para actividades de contenido del dashboard
 * Convierte los datos de recursos/contenido de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para actividades de contenido basado en la entidad Resources
 * @param {Array} apiResources - Datos crudos de recursos desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const contentActivitiesAdapter = (apiResources = []) => {
  if (!apiResources.length) return [];

  // Mapeo de tipos de actividad API a frontend
  const typeMap = {
    created: 'create',
    updated: 'edit',
    published: 'publish',
    deleted: 'delete'
  };

  return apiResources.map(resource => {
    // Determinar el tipo de contenido basado en la URL
    const contentType = determineContentType(resource.url || '');

    return {
      id: resource.id || Math.random().toString(36).substr(2, 9),
      type: resource.id_categories ? 'create' : 'publish', // Suposición basada en categoría asignada
      contentType: contentType,
      title: resource.description || 'Recurso sin título', // La entidad tiene campo 'description'
      user: 'Admin', // No hay campo de usuario en la entidad, se podría obtener de otra fuente
      timestamp: new Date().toISOString(), // No hay campo de fecha en la entidad
      contentId: resource.id || 0,
      categoryId: resource.id_categories || null
    };
  });
};

/**
 * Determina el tipo de contenido basado en la URL del recurso
 * @param {string} url - URL del recurso
 * @returns {string} - Tipo de contenido (video, pdf, article)
 */
function determineContentType(url) {
  if (!url) return 'article';

  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.includes('youtube') ||
    lowerUrl.includes('vimeo') ||
    lowerUrl.endsWith('.mp4')
  ) {
    return 'video';
  } else if (lowerUrl.endsWith('.pdf')) {
    return 'pdf';
  } else {
    return 'article';
  }
}
