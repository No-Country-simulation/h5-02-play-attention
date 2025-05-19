/**
 * Hooks centralizados para operaciones de contenido usando React Query
 * Simplifica la gestión del estado y caché en un solo lugar
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentsApi } from '../api';
import { contentsAdapter, contentAdapter } from '../adapters';
import { toast } from 'sonner';

/**
 * Hook para obtener todos los contenidos
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useContents(options = {}) {
  return useQuery({
    queryKey: ['contents'],
    queryFn: async () => {
      try {
        const contents = await contentsApi.getContents();
        console.log('Contenidos obtenidos de API:', contents);
        const adaptedContents = contentsAdapter(contents);
        console.log('Contenidos adaptados:', adaptedContents);
        return adaptedContents;
      } catch (error) {
        console.error('Error en useContents:', error);
        throw error;
      }
    },
    ...options
  });
}

/**
 * Hook para obtener un contenido específico por ID
 * @param {string} id ID del contenido
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useContent(id, options = {}) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      const content = await contentsApi.getContentById(id);
      return contentAdapter(content);
    },
    enabled: !!id,
    ...options
  });
}

/**
 * Hook para crear un nuevo contenido
 * @returns {Object} Mutation para crear contenido
 */
export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => contentsApi.createContent(formData),
    onSuccess: () => {
      toast.success('Contenido creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: error => {
      console.error('Error detallado al crear contenido:', error);
      toast.error(`Error al crear contenido: ${error.message}`);
    }
  });
}

/**
 * Hook para actualizar un contenido existente
 * @param {string} id ID del contenido a actualizar
 * @returns {Object} Mutation para actualizar contenido
 */
export function useUpdateContent(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => contentsApi.updateContent(id, formData),
    onSuccess: () => {
      toast.success('Contenido actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['content', id] });
    },
    onError: error => {
      console.error('Error detallado al actualizar contenido:', error);
      toast.error(`Error al actualizar contenido: ${error.message}`);
    }
  });
}

/**
 * Hook para eliminar un contenido
 * @returns {Object} Mutation para eliminar contenido
 */
export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: id => contentsApi.deleteContent(id),
    onSuccess: () => {
      toast.success('Contenido eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: error => {
      toast.error(`Error al eliminar contenido: ${error.message}`);
    }
  });
}
