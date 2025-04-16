'use client';

import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

/**
 * Componente para mostrar acciones disponibles en páginas de error
 * Sigue el principio de Segregación de Interfaces (ISP) de SOLID
 */
export const ErrorActions = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-center gap-4'>
      <Button
        onClick={() => window.history.back()}
        variant='secondary'
        className='w-full sm:w-auto bg-[#001f54] hover:bg-[#034078] text-white'
      >
        <ArrowLeft className='w-5 h-5' />
        Volver
      </Button>

      <Button
        asChild
        className='w-full sm:w-auto bg-[#1282a2] hover:bg-[#0a7e9e] text-white'
      >
        <Link href='/'>
          <Home className='w-5 h-5' />
          Volver al inicio
        </Link>
      </Button>
    </div>
  );
};
