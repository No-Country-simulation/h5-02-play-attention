import React, { createContext, useContext } from 'react';
import { useNextAuth } from '@/shared/hooks/useNextAuth';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

// Crear contexto de autenticación
const AuthContext = createContext(null);

/**
 * Proveedor de autenticación para toda la aplicación
 * Proporciona estado y funciones de autenticación a todos los componentes hijos
 *
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Proveedor de autenticación
 */
export function AuthProvider({
  children,
  loadingComponent = (
    <div className='flex justify-center items-center min-h-screen'>
      <LoadingSpinner text='Iniciando sesión...' />
    </div>
  )
}) {
  const auth = useNextAuth();

  // Mientras se inicializa, mostrar componente de carga
  if (auth.isInitializing) {
    return loadingComponent;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook para acceder al contexto de autenticación
 * @returns {object} Contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
