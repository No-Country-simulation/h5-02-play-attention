'use client';

import { LoginForm } from '@/features/auth';
import { useSession } from '@/features/auth/hooks';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Componente hijo que usa useSearchParams
function LoginFormWrapper() {
  const searchParams = useSearchParams();
  // Obtener la URL de redirección si existe
  const redirectUrl = searchParams?.get('redirect') || '/dashboard';

  return <LoginForm redirectUrl={redirectUrl} />;
}

/**
 * Página de login
 * @returns {JSX.Element} Componente de React
 */
export default function LoginPage() {
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
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Tarjeta de login con imagen y formulario */}
      <div className='w-full max-w-4xl bg-white rounded-3xl overflow-hidden flex shadow-lg'>
        {/* Lado izquierdo - Imagen */}
        <div className='hidden md:block w-1/2 relative'>
          <Image
            src='/img/login1.png'
            alt='Background'
            className='object-cover h-full w-full'
            width={1000}
            height={1000}
            priority
          />
          {/* Logo sobrepuesto */}
          <div className='absolute top-6 left-10'>
            <Image
              src='/svgs/logologin.svg'
              alt='Logo'
              width={200}
              height={80}
              className='h-auto'
            />
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className='w-full md:w-1/2 flex items-center justify-center py-8 px-8 md:px-10'>
          <div className='w-full max-w-md'>
            <div className='text-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Iniciar Sesión
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                Ingresa tus credenciales para acceder al panel de administrador.
              </p>
            </div>

            <Suspense
              fallback={
                <div className='text-center py-4'>Cargando formulario...</div>
              }
            >
              <LoginFormWrapper />
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
    </div>
  );
}
