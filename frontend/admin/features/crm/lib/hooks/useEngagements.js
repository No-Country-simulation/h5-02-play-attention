/**
 * Hooks centralizados para operaciones de engagements (contactos) usando React Query
 * Simplifica la gestión del estado y caché en un solo lugar
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { engagementsApi } from '../api/api';
import { toast } from 'sonner';

/**
 * Hook para obtener los engagements (contactos) de un lead específico
 * @param {string} leadId ID del lead
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useLeadEngagements(leadId, options = {}) {
  return useQuery({
    queryKey: ['engagements', leadId],
    queryFn: async () => {
      const response = await engagementsApi.getLeadEngagements(leadId);
      // Devolvemos la respuesta completa para que el adaptador pueda manejarla
      return response;
    },
    enabled: !!leadId,
    ...options
  });
}

/**
 * Hook para crear un nuevo engagement (contacto)
 * @returns {Object} Mutation para crear engagement
 */
export function useCreateEngagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactData => engagementsApi.createEngagement(contactData),
    onSuccess: (data, variables) => {
      toast.success('Contacto registrado correctamente');
      // Invalidar la consulta de engagements para el lead específico
      queryClient.invalidateQueries({
        queryKey: ['engagements', variables.leadId]
      });
    },
    onError: error => {
      toast.error(`Error al registrar contacto: ${error.message}`);
    }
  });
}
