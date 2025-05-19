import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useAuthQuery';
import { AuthService } from '../lib/services/auth-service';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente renderizado
 */
export const PrivateRoute = ({
  children,
  redirectTo = '/login',
  loadingComponent = (
    <div className='flex justify-center items-center h-screen'>Cargando...</div>
  )
}) => {
  const profile = useProfile();
  const isAuthenticated = AuthService.isAuthenticated();
  const isLoading = profile.isLoading;

  // Mostrar componente de carga mientras se verifica la autenticación
  if (isLoading) {
    return loadingComponent;
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Renderizar los children si está autenticado
  return children;
};
