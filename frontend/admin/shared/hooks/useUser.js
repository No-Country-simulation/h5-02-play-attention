import { useQuery } from '@tanstack/react-query';
import { AuthService } from '../lib/services/auth-service';
import { getUserById } from '../lib/api/users';

// Clave para la consulta del usuario actual
const CURRENT_USER_KEY = ['auth', 'currentUser'];

/**
 * Hook para obtener y mantener los datos del usuario actual
 * @returns {Object} Datos y estado del usuario actual
 */
export const useUser = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  const token = AuthService.getToken();
  const userId = AuthService.getCurrentUserId();

  const query = useQuery({
    queryKey: CURRENT_USER_KEY,
    queryFn: async () => {
      // Si no hay token o ID, no hacer la petición
      if (!token || !userId) {
        return null;
      }

      try {
        // Obtener datos del usuario desde la API
        return await getUserById(userId, token);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        // Devolver los datos guardados en localStorage como fallback
        return AuthService.getCurrentUser();
      }
    },
    // Solo ejecutar si hay token y ID de usuario
    enabled: isAuthenticated && !!userId,
    // Mantener los datos en caché incluso después de desmontar el componente
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 60, // 1 hora
    // Intentar obtener desde la caché primero mientras se recarga
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    // Inicializar con los datos guardados en localStorage
    initialData: AuthService.getCurrentUser()
  });

  return {
    ...query,
    isAuthenticated,
    userId
  };
};
