/**
 * Hooks centralizados para operaciones de categorías usando React Query
 * Simplifica la gestión del estado y caché en un solo lugar
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories';
import {
  categoriesAdapter,
  categoryAdapter
} from '../adapters/categories.adapter';
import { toast } from 'sonner';

/**
 * Hook para obtener todas las categorías
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useCategories(options = {}) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await categoriesApi.getCategories();
      return categoriesAdapter(categories);
    },
    ...options
  });
}

/**
 * Hook para obtener una categoría específica por ID
 * @param {string} id ID de la categoría
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useCategory(id, options = {}) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const category = await categoriesApi.getCategoryById(id);
      return categoryAdapter(category);
    },
    enabled: !!id,
    ...options
  });
}

/**
 * Hook para crear una nueva categoría
 * @returns {Object} Mutation para crear categoría
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => categoriesApi.createCategory(formData),
    onSuccess: () => {
      toast.success('Categoría creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: error => {
      console.error('Error detallado al crear categoría:', error);
      toast.error(`Error al crear categoría: ${error.message}`);
    }
  });
}

/**
 * Hook para actualizar una categoría existente
 * @param {string} id ID de la categoría a actualizar
 * @returns {Object} Mutation para actualizar categoría
 */
export function useUpdateCategory(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => categoriesApi.updateCategory(id, formData),
    onSuccess: () => {
      toast.success('Categoría actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
    },
    onError: error => {
      console.error('Error detallado al actualizar categoría:', error);
      toast.error(`Error al actualizar categoría: ${error.message}`);
    }
  });
}

/**
 * Hook para eliminar una categoría
 * @returns {Object} Mutation para eliminar categoría
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: id => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Categoría eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: error => {
      toast.error(`Error al eliminar categoría: ${error.message}`);
    }
  });
}
