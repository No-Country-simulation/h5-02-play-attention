'use client';

import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Componente para mostrar acciones disponibles en páginas de error
 * Sigue el principio de Segregación de Interfaces (ISP) de SOLID
 */
export const ErrorActions = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-center gap-4'>
      <button
        onClick={() => window.history.back()}
        className='inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-[#2a2a32] hover:bg-[#3a3a42] focus:ring-4 focus:ring-[#00ff9940] transition-all'
      >
        <ArrowLeft className='w-5 h-5 mr-2' />
        Volver
      </button>

      <Link
        href='/'
        className='inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-[#1c1c22] rounded-lg bg-[#00ff99] hover:bg-[#00e187] focus:ring-4 focus:ring-[#00ff9940] transition-all'
      >
        <Home className='w-5 h-5 mr-2' />
        Inicio
      </Link>
    </div>
  );
};
