import { useMemo } from 'react';
import { useAuth } from './useNextAuth';

/**
 * Hook para obtener información de rol y permisos del usuario actual
 * Aprovecha React Query a través del hook useAuth para acceder a los datos
 * del usuario autenticado
 *
 * @returns {Object} Información de rol y permisos
 */
export function useRole() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Calcular información de rol usando useMemo para evitar re-cálculos innecesarios
  const roleInfo = useMemo(() => {
    const role = user?.role || 'user';

    // Función para verificar permisos específicos
    const hasPermission = requiredPermission => {
      // Si no hay autenticación, no hay permisos
      if (!isAuthenticated) return false;

      // Si es admin, tiene todos los permisos
      if (role === 'admin') return true;

      // Para el rol 'comercial'
      if (role === 'comercial') {
        return ['crm.view', 'crm.edit', 'dashboard.view'].includes(
          requiredPermission
        );
      }

      // Para otros roles, implementar lógica específica si es necesario
      return false;
    };

    // Verificar acceso a ciertas rutas/áreas
    const canAccessCRM = role === 'admin' || role === 'comercial';
    const canAccessUsers = role === 'admin';
    const canAccessSettings = role === 'admin';
    const canAccessTickets = role === 'admin' || role === 'soporte';

    return {
      role,
      isAdmin: role === 'admin',
      isComercial: role === 'comercial',
      isSoporte: role === 'soporte',
      hasPermission,
      canAccessCRM,
      canAccessUsers,
      canAccessSettings,
      canAccessTickets
    };
  }, [user, isAuthenticated]);

  return {
    ...roleInfo,
    isLoading,
    user
  };
}
