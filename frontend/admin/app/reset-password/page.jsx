'use client';

import { ResetPasswordForm } from '@/features/auth/components';
import { useSession } from '@/features/auth/hooks';
import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Componente intermedio para aislar el uso de useSearchParams
function ResetPasswordFormWrapper() {
  return <ResetPasswordForm />;
}

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
    <div
      className='min-h-screen flex items-center justify-center p-6'
      style={{
        backgroundImage: "url('/img/backgroundlogin.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className='w-full max-w-md bg-white px-10 rounded-3xl overflow-hidden shadow-lg'>
        <div className='px-8 py-10'>
          <div className='text-center mb-8'>
            <div className='flex justify-center'>
              <Image
                src='/svgs/logologin.svg'
                alt='Play Attention Logo'
                width={200}
                height={80}
                className='h-auto'
                priority
              />
            </div>
          </div>

          <Suspense
            fallback={
              <div className='text-center py-4'>Cargando formulario...</div>
            }
          >
            <ResetPasswordFormWrapper />
          </Suspense>

          <div className='text-center mt-6 text-xs text-gray-500'>
            <p>
              © {new Date().getFullYear()} Play Attention Argentina. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
