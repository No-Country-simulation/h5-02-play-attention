import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../api';
import { toast } from 'sonner';

/**
 * Hook para actualizar los datos generales de un usuario
 * Usa React Query para gestionar el estado de la mutación y actualizar la caché
 *
 * @returns {Object} - Objeto de mutación de React Query
 */
const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente');
      // Invalidar la caché para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      console.error('Error al actualizar el usuario:', error);
      toast.error('Error al actualizar el usuario');
    }
  });
};

export default useUpdateUser;
