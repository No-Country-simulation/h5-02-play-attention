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
      {/* Fondo con grid */}
      <div className='absolute inset-0 bg-[#0a1128] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] opacity-30'></div>

      {/* Efectos de brillo */}
      <div className='absolute w-[300px] h-[300px] rounded-full bg-[#1282a2] opacity-10 blur-[100px] top-[20%] left-[10%]'></div>
      <div className='absolute w-[300px] h-[300px] rounded-full bg-[#034078] opacity-10 blur-[100px] bottom-[10%] right-[5%]'></div>
    </div>
  );
};
