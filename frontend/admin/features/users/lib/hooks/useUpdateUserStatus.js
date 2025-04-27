import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserStatus } from '../api';
import { toast } from 'sonner';

/**
 * Hook para actualizar el estado de un usuario
 * Usa React Query para gestionar el estado de la mutación y actualizar la caché
 *
 * @returns {Object} - Objeto de mutación de React Query
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }) => updateUserStatus(userId, isActive),
    onSuccess: (data, variables) => {
      const status = variables.isActive ? 'activado' : 'desactivado';
      toast.success(`Usuario ${status} correctamente`);
      // Invalidar la caché para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      console.error('Error al actualizar el estado del usuario:', error);
      toast.error('Error al actualizar el estado del usuario');
    }
  });
};
