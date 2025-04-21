import React from 'react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

/**
 * Componente que maneja la visualización del logo en el sidebar
 * Usando el logo oficial con indicador de admin
 */
export function SidebarLogo({ expanded, className }) {
  return (
    <div className={cn('flex items-start', className)}>
      {expanded ? (
        // Logo completo para sidebar expandido
        <Image
          src='/svgs/logowhiteadmin.svg'
          alt='Play Attention Admin'
          width={160}
          height={40}
          className='object-contain'
          priority
        />
      ) : (
        // Logo reducido para sidebar colapsado
        <Image
          src='/svgs/logowhite.svg'
          alt='Play Attention'
          width={32}
          height={32}
          className='object-contain'
          priority
        />
      )}
    </div>
  );
}

export default SidebarLogo;
