/**
 * Adaptador para categorías
 * Convierte los datos de categorías de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para una única categoría
 * @param {Object} apiCategory - Datos crudos de categoría desde la API
 * @returns {Object} - Datos formateados para el frontend
 */
export const categoryAdapter = (apiCategory = {}) => {
  if (!apiCategory) return null;

  console.log('Adaptando categoría individual:', apiCategory);

  // Contar los recursos asociados a la categoría
  const resourcesCount = apiCategory.resources_id
    ? apiCategory.resources_id.length
    : 0;

  return {
    id: apiCategory._id || apiCategory.id || '',
    name: apiCategory.name || '',
    description: apiCategory.description || '',
    resourceCount: resourcesCount,
    resourceIds: apiCategory.resources_id || []
  };
};

/**
 * Adaptador para lista de categorías
 * @param {Array} apiCategories - Datos crudos de categorías desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const categoriesAdapter = (apiCategories = []) => {
  console.log('Adaptando lista de categorías:', apiCategories);

  if (!Array.isArray(apiCategories)) {
    console.error(
      'Error: categoriesAdapter esperaba un array pero recibió:',
      apiCategories
    );
    return [];
  }

  if (!apiCategories.length) {
    console.log('No hay categorías para adaptar');
    return [];
  }

  return apiCategories.map(category => categoryAdapter(category));
};
