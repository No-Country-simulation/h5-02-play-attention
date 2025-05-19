import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/users/lib/api/getUsers';

/**
 * Hook personalizado para obtener usuarios que pueden ser asignados a tickets
 * Solo retorna usuarios con roles admin o comercial
 */
export function useAssignableUsers() {
  // Utilizamos useQuery con opciones más robustas
  return useQuery({
    queryKey: ['assignableUsers'],
    queryFn: async () => {
      try {
        // Obtener todos los usuarios
        const allUsers = await getUsers();
        console.log(
          'HOOK: Todos los usuarios obtenidos:',
          allUsers?.length || 0
        );

        // Verificar formato de datos
        if (!Array.isArray(allUsers)) {
          console.error('HOOK: La respuesta no es un array', allUsers);
          return []; // Devolver array vacío en caso de error
        }

        // Validar usuarios - filtrar solo los que tienen ID y son objetos válidos
        const validUsers = allUsers.filter(
          user => user && typeof user === 'object' && (user._id || user.id)
        );

        // Filtrar solo usuarios comerciales y admin
        const filteredUsers = validUsers.filter(user => {
          if (!user.role) {
            console.log('HOOK: Usuario sin rol:', user);
            return false;
          }

          const role = String(user.role).toLowerCase();
          return role === 'comercial' || role === 'admin';
        });

        console.log('HOOK: Usuarios filtrados:', filteredUsers.length);

        // Normalizar la estructura de datos
        const normalizedUsers = filteredUsers.map(user => ({
          _id: user._id || user.id || '',
          fullname: user.fullname || user.name || user.email || 'Sin nombre',
          email: user.email || '',
          role: user.role || ''
        }));

        console.log('HOOK: Usuarios normalizados finales:', normalizedUsers);
        return normalizedUsers;
      } catch (error) {
        console.error('HOOK: Error obteniendo usuarios:', error);
        return []; // Devolver array vacío en caso de error
      }
    },
    // Opciones adicionales para mejorar la experiencia
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 1,
    onError: error => {
      console.error('HOOK: Error en la consulta:', error);
    }
  });
}
