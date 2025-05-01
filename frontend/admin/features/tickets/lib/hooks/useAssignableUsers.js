import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/users/lib/api/getUsers';

/**
 * Hook personalizado para obtener usuarios que pueden ser asignados a tickets
 * Solo retorna usuarios con roles admin o comercial
 */
export function useAssignableUsers() {
  const {
    data: users = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['assignableUsers'],
    queryFn: async () => {
      const allUsers = await getUsers();
      // Para debug

      // Filtramos usuarios que NO sean del tipo 'User'
      const filteredUsers = allUsers.filter(
        user => user.role?.toLowerCase() !== 'user'
      );

      console.log('Usuarios filtrados:', filteredUsers); // Para debug

      return filteredUsers;
    }
  });

  return {
    users,
    isLoading,
    error
  };
}
