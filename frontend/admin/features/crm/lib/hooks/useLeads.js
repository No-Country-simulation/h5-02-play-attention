/**
 * Hooks centralizados para operaciones de leads usando React Query
 * Simplifica la gestión del estado y caché en un solo lugar
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api';
import { leadsAdapter } from '../adapters';
import { toast } from 'sonner';

/**
 * Hook para obtener todos los leads
 * @param {Object} options Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useLeads(options = {}) {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const leads = await leadsApi.getLeads();
      return leadsAdapter(leads);
    },
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
    queryFn: async () => {
      const lead = await leadsApi.getLeadById(id);
      return leadsAdapter(lead);
    },
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
 * Hook para actualizar solo el estado de un lead
 * @returns {Object} Mutation para actualizar el estado del lead
 */
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, status }) => {
      // Validación estricta del ID
      if (!leadId || typeof leadId !== 'string' || leadId.trim() === '') {
        throw new Error(`ID del lead inválido: "${leadId}"`);
      }

      console.log(`🔄 Actualizando lead ${leadId} a estado: ${status}`);

      // Obtener el lead actual para preservar sus datos
      const currentLead = await leadsApi.getLeadById(leadId);

      if (!currentLead) {
        throw new Error(`No se encontró el lead con ID: "${leadId}"`);
      }

      // Adaptar el lead al formato del frontend
      const adaptedLead = leadsAdapter(currentLead);

      // Importamos las funciones del archivo de configuración
      const { mapSourceToBackend, mapUserTypeToService } = await import(
        '../api/config'
      );

      // Crear payload manteniendo los datos del lead y actualizando el estado
      // Nota: Ahora el status ya viene en formato backend desde el componente LeadList
      const payload = {
        fullname: adaptedLead.name || 'Nombre temporal',
        email: adaptedLead.email || 'correo@ejemplo.com',
        phone: adaptedLead.phone || '123456789',
        company: adaptedLead.company || '',
        service: mapUserTypeToService(adaptedLead.userType),
        notes: adaptedLead.notes || '',
        status: status, // El estado ya viene en formato correcto
        origen: mapSourceToBackend(adaptedLead.source) || 'Sitio web',
        relation: adaptedLead.position || 'Usuario'
      };

      return leadsApi.updateLead(leadId, payload);
    },
    onSuccess: () => {
      toast.success('Estado del lead actualizado');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: error => {
      toast.error(`Error al actualizar estado: ${error.message}`);
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
