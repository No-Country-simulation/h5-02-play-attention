'use client';

import { LoginForm } from '@/features/auth';
import { useSession } from '@/features/auth/hooks';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { BarChart3, Users, FileText, Briefcase } from 'lucide-react';

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
    <div className='min-h-screen grid md:grid-cols-2'>
      {/* Panel lateral con imagen o color de fondo */}
      <div className='hidden md:flex bg-purple-800 relative overflow-hidden'>
        <div className='absolute inset-0 flex flex-col justify-center items-center p-10 bg-gradient-to-b from-purple-800/90 to-purple-900/90 text-white z-10'>
          <div className='max-w-md mx-auto text-center'>
            <h2 className='text-3xl font-extrabold mb-6 animate-fadeIn'>
              Play Attention
            </h2>

            <div className='space-y-6'>
              <FeatureItem
                icon={<BarChart3 className='h-8 w-8 text-purple-300' />}
                title='Panel de Administración'
                description='Gestiona todos los aspectos de la plataforma desde un solo lugar'
                delay='0s'
              />

              <FeatureItem
                icon={<Briefcase className='h-8 w-8 text-purple-300' />}
                title='CRM Integrado'
                description='Sistema completo para gestión de clientes y leads'
                delay='0.3s'
              />

              <FeatureItem
                icon={<Users className='h-8 w-8 text-purple-300' />}
                title='Gestión de Usuarios'
                description='Control total sobre permisos y roles'
                delay='0.6s'
              />

              <FeatureItem
                icon={<FileText className='h-8 w-8 text-purple-300' />}
                title='Contenido y Recursos'
                description='Administra el contenido de la plataforma fácilmente'
                delay='0.9s'
              />
            </div>
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
              <div className='h-16 w-16 animate-pulse'>
                <Image
                  src='/img/logospinner.png'
                  alt='Play Attention Logo'
                  width={64}
                  height={64}
                  priority
                />
              </div>
            </div>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              Iniciar sesión
            </h2>
            <p className='mt-2 text-gray-600'>
              Ingresa tus credenciales para acceder al panel de administración y
              CRM
            </p>
          </div>

          <div className='mt-8 bg-white p-8 shadow sm:rounded-lg'>
            <Suspense
              fallback={
                <div className='text-center py-4'>Cargando formulario...</div>
              }
            >
              <LoginFormWrapper />
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
    </div>
  );
}

/**
 * Componente para mostrar una característica con animación
 */
function FeatureItem({ icon, title, description, delay }) {
  return (
    <div
      className='flex items-center text-left animate-slideInRight'
      style={{ animationDelay: delay }}
    >
      <div className='bg-white/10 p-3 rounded-lg mr-4 backdrop-blur-sm'>
        {icon}
      </div>
      <div>
        <h3 className='font-bold text-lg'>{title}</h3>
        <p className='text-purple-100 text-sm'>{description}</p>
      </div>
    </div>
  );
}
