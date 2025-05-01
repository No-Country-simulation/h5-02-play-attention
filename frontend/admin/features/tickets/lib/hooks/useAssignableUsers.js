import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/users/lib/api/getUsers';

/**
 * Hook personalizado para obtener usuarios que pueden ser asignados a tickets
 * Solo retorna usuarios con roles admin o comercial
 */
export function useAssignableUsers() {
  return useQuery({
    queryKey: ['assignableUsers'],
    queryFn: async () => {
      const allUsers = await getUsers();
      // Filtramos usuarios que NO sean del tipo 'User'
      const filteredUsers = allUsers.filter(
        user => user.role?.toLowerCase() !== 'user'
      );

      console.log('Usuarios asignables:', filteredUsers);

      return filteredUsers;
    },
    staleTime: 5 * 60 * 1000 // 5 minutos
  });
}
