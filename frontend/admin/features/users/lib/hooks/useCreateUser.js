import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api';
import { toast } from 'sonner';

/**
 * Hook para crear un nuevo usuario
 * @returns {Object} - Objeto con la mutación y funciones relacionadas
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidar la caché de usuarios para forzar una recarga
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado correctamente');
    },
    onError: error => {
      console.error('Error al crear usuario:', error);

      // Detectar específicamente el caso de email ya registrado
      if (error.message && error.message.includes('Email ya registrado')) {
        toast.error('El email ya está registrado en el sistema', {
          description: 'Por favor utilice un correo electrónico diferente',
          duration: 5000
        });
      } else {
        toast.error(`Error al crear usuario: ${error.message}`);
      }
    }
  });
};
