import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useAuthQuery';
import { AuthService } from '../lib/services/auth-service';
import { LoadingSpinner } from './loading-spinner';

/**
 * Componente para proteger rutas basadas en roles de usuario
 * - admin: tiene acceso a todas las rutas
 * - comercial: solo tiene acceso a CRM
 * - otros roles: acceso según allowedRoles
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar si el usuario tiene permiso
 * @param {string[]} props.allowedRoles - Roles permitidos para acceder a esta ruta
 * @param {string} props.redirectTo - Ruta a la que redirigir si no tiene permiso
 * @param {React.ReactNode} props.loadingComponent - Componente a mostrar mientras carga
 * @param {React.ReactNode} props.unauthorizedComponent - Componente a mostrar si no tiene permiso
 * @returns {JSX.Element} Componente renderizado
 */
export const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/dashboard',
  loadingComponent = <LoadingSpinner text='Verificando permisos...' />,
  unauthorizedComponent = null
}) => {
  // Obtener datos de perfil y autenticación
  const { data: user, isLoading } = useProfile();
  const isAuthenticated = AuthService.isAuthenticated();

  // Mostrar componente de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        {loadingComponent}
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // Obtener el rol del usuario autenticado
  const userRole = user?.role || 'user';

  // Reglas de acceso específicas:
  // 1. Los admins tienen acceso a todas las rutas
  if (userRole === 'admin') {
    return children;
  }

  // 2. Los usuarios comerciales solo tienen acceso a CRM
  if (userRole === 'comercial') {
    // Si la ruta actual contiene '/crm' o es una de las permitidas para este rol
    const isCrmRoute = window.location.pathname.includes('/crm');
    const hasAccess = isCrmRoute || allowedRoles.includes('comercial');

    if (hasAccess) {
      return children;
    }
  }

  // 3. Para otros roles, verificar si están en allowedRoles
  if (allowedRoles.includes(userRole)) {
    return children;
  }

  // Si se proporcionó un componente para acceso no autorizado, mostrarlo
  if (unauthorizedComponent) {
    return unauthorizedComponent;
  }

  // Por defecto, redirigir a la ruta especificada
  return <Navigate to={redirectTo} replace />;
};
