/**
 * Archivo de barril (index) para APIs de categorías
 * Centraliza todas las exportaciones para facilitar la importación en componentes
 */

// Importar las funciones individuales
import { getCategories } from './getCategories';
import { getCategoryById } from './getCategoryById';
import { createCategory } from './createCategory';
import { updateCategory } from './updateCategory';
import { deleteCategory } from './deleteCategory';

// Mantener una estructura para compatibilidad con patrones existentes
export const categoriesApi = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

// También exportar las funciones individuales para uso directo
export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
