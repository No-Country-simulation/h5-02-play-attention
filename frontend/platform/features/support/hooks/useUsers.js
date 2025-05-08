import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../lib/api/users';

/**
 * Hook para gestionar los usuarios del sistema
 * @returns {Object} Operaciones y datos de usuarios
 */
export const useUsers = () => {
  // Obtener todos los usuarios
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ limit: 100 }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    // Cargar inmediatamente
    enabled: true,
    // Reintentar varias veces en caso de error
    retry: 3,
    retryDelay: 1000
  });

  // Función para obtener un usuario por ID
  const getUserById = userId => {
    if (!usersQuery.data || !userId) return null;

    const users = usersQuery.data.data || [];

    // Buscar en diferentes formatos de ID posibles
    return users.find(
      user =>
        user.id === userId ||
        user._id === userId ||
        String(user.id) === String(userId) ||
        String(user._id) === String(userId)
    );
  };

  // Obtener el nombre completo de un usuario por ID
  const getUserNameById = userId => {
    if (!userId) return 'Usuario';

    // Buscar usuario por ID
    const user = getUserById(userId);

    // Si encontramos el usuario, devolver su nombre
    if (user) {
      // Priorizar fullname o combinación de firstName y lastName
      if (user.fullname) return user.fullname;
      if (user.name) return user.name;

      // Construir nombre a partir de firstName y lastName si existen
      const firstName = user.firstName || user.first_name || '';
      const lastName = user.lastName || user.last_name || '';
      const composedName = `${firstName} ${lastName}`.trim();
      if (composedName) return composedName;

      // Si hay email, usarlo como último recurso
      if (user.email) return user.email;
    }

    // Si no encontramos información o el usuario no existe, devolver nombre predeterminado
    console.log(`No se encontró información para el usuario con ID: ${userId}`);
    return 'Soporte';
  };

  // Crear un mapa de IDs a objetos de usuario completos para acceso rápido
  const createUserMap = () => {
    if (!usersQuery.data) return {};

    const users = usersQuery.data.data || [];
    return users.reduce((map, user) => {
      // Usar tanto id como _id para mayor compatibilidad
      const id = user.id || user._id;
      if (id) {
        map[id] = {
          id,
          name: getUserNameById(id),
          email: user.email,
          avatar: user.avatar || user.avatarUrl || null,
          // Guardar todo el objeto usuario para posible uso posterior
          fullData: user
        };
      }
      return map;
    }, {});
  };

  // Crear el mapa de usuarios
  const userMap = createUserMap();

  return {
    // Datos
    users: usersQuery.data?.data || [],
    userMap,

    // Estado
    loading: usersQuery.isLoading,
    error: usersQuery.error?.message,

    // Funciones de utilidad
    getUserById,
    getUserNameById,

    // Otras operaciones
    refetch: usersQuery.refetch
  };
};

export default useUsers;
