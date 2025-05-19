'use client';

import { useState, useEffect } from 'react';

/**
 * Componente que proporciona un fondo visual con efecto de grid para las páginas de error
 * Sigue el principio de responsabilidad única (SRP) de SOLID
 */
export const ErrorBackgroundGrid = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
      <div className='absolute inset-0 bg-[#121217] opacity-60' />
      <div className='absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#000_70%)]' />

      {/* Decorative glowing circles with blur effect */}
      <div className='absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#00ff99] opacity-10 blur-[100px]' />
      <div className='absolute bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-[#00e187] opacity-10 blur-[100px]' />
    </div>
  );
};
