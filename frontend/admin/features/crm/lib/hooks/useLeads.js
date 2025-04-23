/**
 * Hooks centralizados para operaciones de leads usando React Query
 * Simplifica la gestión del estado y caché en un solo lugar
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/api';
import { toast } from 'sonner';

/**
 * Hook para obtener todos los leads
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useLeads(options = {}) {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsApi.getLeads(),
    ...options
  });
}

/**
 * Hook para obtener un lead específico por ID
 * @param {string} id ID del lead
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useLead(id, options = {}) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLeadById(id),
    enabled: !!id,
    ...options
  });
}

/**
 * Hook para crear un nuevo lead
 * @returns {Object} Mutation para crear lead
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => leadsApi.createLead(formData),
    onSuccess: () => {
      toast.success('Lead creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: error => {
      toast.error(`Error al crear lead: ${error.message}`);
    }
  });
}

/**
 * Hook para actualizar un lead existente
 * @param {string} id ID del lead a actualizar
 * @returns {Object} Mutation para actualizar lead
 */
export function useUpdateLead(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formData => leadsApi.updateLead(id, formData),
    onSuccess: () => {
      toast.success('Lead actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
    },
    onError: error => {
      toast.error(`Error al actualizar lead: ${error.message}`);
    }
  });
}

/**
 * Hook para eliminar un lead
 * @returns {Object} Mutation para eliminar lead
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: id => leadsApi.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: error => {
      toast.error(`Error al eliminar lead: ${error.message}`);
    }
  });
}
