'use client';

import dynamic from 'next/dynamic';

// Cargamos el UserMenu dinámicamente para evitar problemas de hidratación
const UserMenu = dynamic(() => import('@/features/auth/components/UserMenu'), {
  ssr: false,
  loading: () => (
    <div className='w-32 h-10 bg-accent/20 animate-pulse rounded-lg' />
  )
});

/**
 * Componente reutilizable para el encabezado de páginas
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse únicamente
 * de mostrar el título y subtítulo de una página
 */
export default function PageHeader({
  title,
  description,
  className = '',
  children
}) {
  return (
    <header className={`mb-8 pb-4 border-b ${className}`}>
      <div className='flex justify-between items-center'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <h1 className='text-3xl font-bold'>{title}</h1>
          </div>
          {description && <p className='text-gray-500'>{description}</p>}
        </div>
        <div className='flex-shrink-0 flex items-center gap-4'>
          {children}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
