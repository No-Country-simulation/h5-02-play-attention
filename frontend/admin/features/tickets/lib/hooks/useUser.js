/**
 * Hook para obtener información de un usuario
 */

import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../api/users/getUserById';

/**
 * Hook para obtener información de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @param {Object} options - Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useUser(userId, options = {}) {
  console.log(`[DEBUG] useUser: Hook llamado con ID: "${userId}"`);

  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log(`[DEBUG] useUser: queryFn ejecutándose para ID: "${userId}"`);

      if (!userId) {
        console.warn('[WARN] useUser: ID de usuario vacío, devolviendo null');
        return null;
      }

      try {
        const userData = await getUserById(userId);
        console.log(
          `[DEBUG] useUser: Datos obtenidos para usuario ${userId}:`,
          userData
        );
        return userData;
      } catch (error) {
        console.error(
          `[ERROR] useUser: Error al obtener datos para usuario ${userId}:`,
          error
        );
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
    onSuccess: data => {
      console.log(
        `[SUCCESS] useUser: Datos cargados exitosamente para usuario ${userId}:`,
        data
      );
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: error => {
      console.error(
        `[ERROR] useUser: Error en la consulta para usuario ${userId}:`,
        error
      );
      if (options.onError) options.onError(error);
    }
  });
}
