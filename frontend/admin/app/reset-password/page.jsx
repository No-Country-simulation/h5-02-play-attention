'use client';

import { ResetPasswordForm } from '@/features/auth/components';
import { useSession } from '@/features/auth/hooks';
import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Página de restablecimiento de contraseña
 * @returns {JSX.Element} Componente de React
 */
export default function ResetPasswordPage() {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!isLoading && session.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [session, router, isLoading]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <div className='flex justify-center mb-4'>
            <div className='h-16 w-16'>
              <Image
                src='/img/logospinner.png'
                alt='Play Attention Logo'
                width={64}
                height={64}
                priority
              />
            </div>
          </div>
          <h1 className='text-3xl font-extrabold text-gray-900'>
            Play Attention
          </h1>
          <p className='mt-2 text-sm text-gray-600'>Panel de administración</p>
        </div>

        <div className='mt-8 bg-white p-8 shadow sm:rounded-lg'>
          <Suspense
            fallback={
              <div className='text-center py-4'>Cargando formulario...</div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>

        <div className='text-center mt-4 text-sm text-gray-500'>
          <p>
            © {new Date().getFullYear()} Play Attention Argentina. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
