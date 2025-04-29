'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, getUserProfile } from '../services';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Hook para gestionar el login de usuarios
 * @param {string} redirectUrl - URL a la que redirigir después del login
 * @returns {Object} - Resultados y funciones para el login
 */
export const useLogin = (redirectUrl = '/dashboard') => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      // Verificar si el usuario tiene rol permitido
      const userRole = data.user?.role;

      if (userRole === 'User' || userRole === 'user') {
        // Mostrar modal de acceso denegado
        setShowAccessDenied(true);
        return;
      }

      // Si el rol es permitido, continuar con el flujo normal
      // Actualizar la caché con los datos del usuario
      queryClient.setQueryData(['session'], {
        isAuthenticated: true,
        user: data.user
      });

      // Invalidar la consulta del usuario para asegurar datos actualizados en futuros fetchs
      queryClient.invalidateQueries({ queryKey: ['session'] });

      // Redirigir a la URL especificada después del login
      router.push(redirectUrl);
    }
  });

  return {
    ...loginMutation,
    showAccessDenied,
    closeAccessDenied: () => setShowAccessDenied(false)
  };
};

/**
 * Hook para gestionar el logout de usuarios
 * @returns {Object} - Resultados y funciones para el logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Invalidar y resetear el estado de la sesión
      queryClient.setQueryData(['session'], {
        isAuthenticated: false,
        user: null
      });
      queryClient.invalidateQueries({ queryKey: ['session'] });

      // Redirigir al login
      router.push('/login');
    }
  });
};

/**
 * Hook para obtener y mantener el estado de la sesión del usuario
 * @returns {Object} - Datos de la sesión actual y estado de carga
 */
export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: getUserProfile,
    initialData: { isAuthenticated: false, user: null },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
    select: data => ({
      isAuthenticated: !!data.user,
      user: data.user || null
    }),
    onError: () => {
      // Si hay error, asumimos que no hay sesión
      return { isAuthenticated: false, user: null };
    }
  });
};
