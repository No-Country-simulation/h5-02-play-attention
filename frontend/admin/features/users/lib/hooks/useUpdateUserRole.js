import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRole } from '../api';
import { toast } from 'sonner';

/**
 * Hook para actualizar el rol de un usuario
 * Usa React Query para gestionar el estado de la mutación y actualizar la caché
 *
 * @returns {Object} - Objeto de mutación de React Query
 */
const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('Rol de usuario actualizado correctamente');
      // Invalidar la caché para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      console.error('Error al actualizar el rol:', error);
      toast.error('Error al actualizar el rol de usuario');
    }
  });
};

export default useUpdateUserRole;
