'use client';

import { LoginForm } from '@/features/auth';
import { useSession } from '@/features/auth/hooks';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

/**
 * Página de login
 * @returns {JSX.Element} Componente de React
 */
export default function LoginPage() {
  const { data: session, isLoading } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener la URL de redirección si existe
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!isLoading && session.isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [session, router, isLoading, redirectUrl]);

  return (
    <div className='min-h-screen grid md:grid-cols-2'>
      {/* Panel lateral con imagen o color de fondo */}
      <div className='hidden md:flex bg-indigo-800 relative overflow-hidden'>
        <div className='absolute inset-0 flex flex-col justify-center items-center p-10 bg-gradient-to-b from-indigo-800/90 to-indigo-900/90 text-white z-10'>
          <div className='max-w-md mx-auto text-center'>
            <h2 className='text-3xl font-extrabold mb-4'>Play Attention</h2>
            <p className='text-lg mb-8'>
              Panel de administración para gestionar contenido, usuarios y más.
            </p>
          </div>
        </div>
        <Image
          src='/images/login-background.jpg'
          alt='Background'
          className='absolute inset-0 object-cover h-full w-full opacity-20'
          width={1000}
          height={1000}
          priority
        />
      </div>

      {/* Formulario de login */}
      <div className='flex items-center justify-center p-8 bg-gray-50'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <div className='flex justify-center mb-4'>
              <div className='h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center'>
                <span className='text-white text-xl font-bold'>PA</span>
              </div>
            </div>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              Iniciar sesión
            </h2>
            <p className='mt-2 text-gray-600'>
              Ingresa tus credenciales para acceder al panel de administración
            </p>
          </div>

          <div className='mt-8 bg-white p-8 shadow sm:rounded-lg'>
            <LoginForm redirectUrl={redirectUrl} />
          </div>

          <div className='text-center mt-4 text-sm text-gray-500'>
            <p>
              © {new Date().getFullYear()} Play Attention. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
