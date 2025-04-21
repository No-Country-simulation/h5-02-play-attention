'use client';

import Link from 'next/link';

/**
 * Página de error 404 personalizada
 * Implementada con Tailwind CSS
 */
export default function NotFound() {
  return (
    <div className='min-h-screen w-full bg-primary text-white flex flex-col items-center justify-center'>
      {/* Fondo */}
      <div className='absolute inset-0 bg-primary bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]'></div>

      {/* Efectos de brillo */}
      <div className='absolute w-[300px] h-[300px] rounded-full bg-secondary opacity-20 blur-[100px] top-[20%] left-[10%]'></div>
      <div className='absolute w-[300px] h-[300px] rounded-full bg-secondary opacity-20 blur-[100px] bottom-[10%] right-[5%]'></div>

      <main className='text-center p-8 max-w-md relative z-10'>
        {/* Código de error */}
        <h1 className='text-9xl font-black bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent drop-shadow-lg'>
          404
        </h1>

        <h2 className='text-2xl font-bold mt-4 mb-2 text-white'>
          Página no encontrada
        </h2>
        <p className='mb-8 text-white/90'>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Botones */}
        <div className='flex gap-4 justify-center flex-wrap'>
          <button
            onClick={() => window.history.back()}
            className='py-3 px-6 rounded-lg font-medium bg-primary-foreground text-primary hover:bg-white transition-colors shadow-md'
          >
            Volver
          </button>
          <Link
            href='/'
            className='py-3 px-6 rounded-lg font-medium bg-secondary text-primary font-semibold hover:bg-secondary/90 transition-colors shadow-md'
          >
            Volver al inicio
          </Link>
        </div>

        {/* Marca */}
        <div className='mt-16'>
          <p className='font-bold text-xl text-white'>Play Attention</p>
          <p className='text-sm text-white/80'>
            Mantente enfocado, mantente productivo
          </p>
        </div>
      </main>
    </div>
  );
}
