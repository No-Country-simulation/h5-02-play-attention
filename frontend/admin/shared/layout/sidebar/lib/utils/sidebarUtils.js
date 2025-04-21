/**
 * Utilidades para el sidebar
 * Contiene la lógica para determinar si un ítem está activo
 */

/**
 * Determina si un ítem del menú está activo basado en la ruta actual
 * @param {string} itemPath - Ruta del ítem del menú
 * @param {string} currentPath - Ruta actual de navegación
 * @returns {boolean} - Verdadero si el ítem está activo
 */
export function isItemActive(itemPath, currentPath) {
  // La ruta exacta para la página principal
  if (itemPath === '/' && currentPath === '/') {
    return true;
  }
  // Para otras rutas, verificamos si la ruta actual comienza con la ruta del ítem
  return itemPath !== '/' && currentPath.startsWith(itemPath);
}
