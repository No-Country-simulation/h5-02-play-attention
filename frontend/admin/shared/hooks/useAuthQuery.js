import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../lib/services/auth-service';

// Claves para las consultas
export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'],
  login: ['auth', 'login'],
  changePassword: ['auth', 'changePassword'],
  forgotPassword: ['auth', 'forgotPassword']
};

/**
 * Hook para iniciar sesión
 * @returns {Object} - Estado de la mutación y función para iniciar sesión
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => AuthService.login(email, password),
    onSuccess: data => {
      // Considerar tanto token como playAttentionToken en la respuesta
      if (data && data.user) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
        console.log('Perfil de usuario almacenado en caché de React Query');
      } else {
        console.warn(
          'No se pudo almacenar el perfil: datos de usuario no disponibles'
        );
      }
    },
    onError: error => {
      console.error('Error en login mutation:', error);
    }
  });
};

/**
 * Hook para cerrar sesión
 * @returns {Function} - Función para cerrar sesión
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    AuthService.logout();
    queryClient.removeQueries({ queryKey: ['auth'] });
  };
};

/**
 * Hook para cambiar contraseña
 * @returns {Object} - Estado de la mutación y función para cambiar contraseña
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      AuthService.changePassword(currentPassword, newPassword)
  });
};

/**
 * Hook para solicitar recuperación de contraseña
 * @returns {Object} - Estado de la mutación y función para recuperar contraseña
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: email => AuthService.forgotPassword(email)
  });
};

/**
 * Hook para obtener el perfil del usuario
 * @param {Object} options - Opciones adicionales para la consulta
 * @returns {Object} - Estado de la consulta y datos del perfil
 */
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: () => AuthService.getProfile(),
    enabled: AuthService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
    ...options
  });
};
