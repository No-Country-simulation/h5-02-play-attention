import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api';

/**
 * Hook para gestionar usuarios con paginación, filtrado y ordenamiento en el cliente
 * @param {Object} options - Opciones de paginación, filtrado y ordenamiento
 * @param {number} options.page - Página actual
 * @param {number} options.limit - Resultados por página
 * @param {string} options.status - Filtro por estado (active, inactive, all)
 * @param {string} options.search - Término de búsqueda
 * @param {string} options.sort - Ordenamiento (newest, oldest, alphabetical)
 */
const useUsers = ({
  page = 1,
  limit = 6,
  status = 'all',
  search = '',
  sort = 'newest'
} = {}) => {
  // Obtener todos los usuarios con configuración de revalidación
  const query = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60, // Considerar datos obsoletos después de 1 minuto
    refetchOnMount: 'always', // Recargar datos cuando el componente se monta
    refetchOnWindowFocus: true, // Recargar cuando la ventana recupera el foco
    refetchInterval: 1000 * 30 // Revalidar cada 30 segundos
  });

  // Si hay error o está cargando, retornar estado inicial
  if (query.isError || query.isLoading) {
    return {
      ...query,
      data: {
        data: [],
        total: 0,
        page,
        totalPages: 1,
        currentCount: 0
      }
    };
  }

  let filteredUsers = [...(query.data || [])];

  // Aplicar filtro por estado
  if (status !== 'all') {
    const isActive = status === 'active';
    filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
  }

  // Aplicar búsqueda
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      user =>
        user.fullname?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
    );
  }

  // Aplicar ordenamiento
  filteredUsers.sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'alphabetical':
        return a.fullname.localeCompare(b.fullname);
      default:
        return 0;
    }
  });

  // Calcular paginación
  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Asegurar que la página actual es válida
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * limit;
  const endIndex = startIndex + limit;

  // Obtener usuarios de la página actual
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    ...query,
    data: {
      data: paginatedUsers,
      total,
      page: validPage,
      totalPages,
      currentCount: paginatedUsers.length
    }
  };
};

export default useUsers;
