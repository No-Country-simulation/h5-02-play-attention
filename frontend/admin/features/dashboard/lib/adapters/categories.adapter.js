/**
 * Adaptador para categorías del dashboard
 * Convierte los datos de categorías de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para categorías
 * @param {Array} apiCategories - Datos crudos de categorías desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const categoriesAdapter = (apiCategories = []) => {
  if (!apiCategories.length) return [];

  return apiCategories.map(category => ({
    id: category.id || '',
    name: category.name || '',
    description: category.description || '',
    resourceCount: 0, // Este dato podría venir de una fuente separada o calcularse
    iconName: getCategoryIcon(category.name || ''),
    colorScheme: getCategoryColorScheme(category.id || 0)
  }));
};

/**
 * Determina un icono apropiado basado en el nombre de la categoría
 * @param {string} categoryName - Nombre de la categoría
 * @returns {string} - Nombre del icono a utilizar
 */
function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();

  if (name.includes('video')) return 'video';
  if (name.includes('audio')) return 'music';
  if (name.includes('document') || name.includes('pdf')) return 'file-text';
  if (name.includes('image') || name.includes('foto')) return 'image';
  if (name.includes('curso')) return 'graduation-cap';

  // Icono por defecto
  return 'folder';
}

/**
 * Asigna un esquema de color basado en el ID de la categoría
 * @param {number|string} categoryId - ID de la categoría
 * @returns {string} - Nombre del esquema de color
 */
function getCategoryColorScheme(categoryId) {
  // Asignar colores basados en el ID para tener una distribución consistente
  const colorSchemes = [
    'blue',
    'green',
    'red',
    'purple',
    'orange',
    'teal',
    'pink'
  ];
  const index =
    typeof categoryId === 'number'
      ? categoryId % colorSchemes.length
      : parseInt(categoryId, 10) % colorSchemes.length || 0;

  return colorSchemes[index];
}
