import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api';
import { toast } from 'sonner';

/**
 * Hook para crear un nuevo usuario
 * @returns {Object} - Objeto con la mutación y funciones relacionadas
 */
const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async newUser => {
      // Obtener los datos actuales de la caché
      const queryKey = ['users'];
      const currentData = queryClient.getQueryData(queryKey);

      // Invalidar todas las queries de usuarios para forzar una recarga
      await queryClient.invalidateQueries({
        queryKey: queryKey,
        refetchType: 'all' // Esto asegura que se recarguen todas las páginas
      });

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

export default useCreateUser;
