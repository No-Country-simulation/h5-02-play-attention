import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Clave para almacenar la consulta de autenticación
export const AUTH_QUERY_KEY = ['auth', 'session'];

/**
 * Hook personalizado para manejar la autenticación en Next.js
 * Utiliza las API routes de Next.js y cookies para gestionar la sesión
 * Aprovecha React Query para manejo de estado global
 *
 * @returns {Object} - Funciones y estado de autenticación
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * Consulta para obtener datos de sesión actual
   */
  const sessionQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar sesión');
      }

      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  /**
   * Mutación para iniciar sesión
   */
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      return data;
    },
    onSuccess: data => {
      // Actualizar la consulta de sesión
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: true,
        user: data.user
      });

      toast.success('Sesión iniciada correctamente');
    },
    onError: error => {
      console.error('Error al iniciar sesión:', error);
      toast.error(`Error: ${error.message}`);
    }
  });

  /**
   * Mutación para cerrar sesión
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cerrar sesión');
      }

      return data;
    },
    onSuccess: () => {
      // Actualizar la consulta de sesión
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: false,
        user: null
      });

      // Invalidar todas las consultas para evitar datos de sesión anterior
      queryClient.invalidateQueries();

      // Redirigir a la página de login
      router.push('/auth/login');

      toast.success('Sesión cerrada correctamente');
    },
    onError: error => {
      console.error('Error al cerrar sesión:', error);
      toast.error(`Error: ${error.message}`);
    }
  });

  // Efecto para inicializar el estado
  useEffect(() => {
    if (!sessionQuery.isLoading) {
      setIsInitializing(false);
    }
  }, [sessionQuery.isLoading]);

  /**
   * Función para iniciar sesión
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} redirectTo - URL a redirigir después del login
   */
  const login = async (credentials, redirectTo = '/dashboard') => {
    try {
      await loginMutation.mutateAsync(credentials);
      router.push(redirectTo);
    } catch (error) {
      // El manejo de errores ya está en onError de la mutación
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    // Estado de autenticación
    isInitializing,
    isAuthenticated: sessionQuery.data?.authenticated || false,
    isLoading: sessionQuery.isLoading || loginMutation.isPending,
    user: sessionQuery.data?.user || null,

    // Funciones
    login,
    logout,

    // Estado de mutaciones
    loginMutation,
    logoutMutation
  };
}
