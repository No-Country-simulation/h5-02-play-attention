'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/shared/lib/services/auth-service';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

/**
 * Página principal que redirecciona según el estado de autenticación
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = AuthService.isAuthenticated();

    // Redireccionar al dashboard o al login
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  // Mostrar pantalla de carga mientras se realiza la redirección
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-white mb-4'>Play Attention</h1>
        <p className='text-purple-200 mb-8'>Panel de Administración</p>
      </div>
      <LoadingSpinner className='w-12 h-12 text-white' />
    </div>
  );
}
