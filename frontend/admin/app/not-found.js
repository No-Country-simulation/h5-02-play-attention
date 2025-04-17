'use client';

/**
 * Página de error 404 personalizada
 * Implementada con Tailwind CSS
 */
export default function NotFound() {
  return (
    <html lang='es'>
      <head>
        <title>404 - Página no encontrada</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className='bg-[#121217] text-white'>
        <div className='min-h-screen flex flex-col items-center justify-center'>
          {/* Fondo */}
          <div className='absolute inset-0 bg-[#121217] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] opacity-30'></div>

          {/* Efectos de brillo */}
          <div className='absolute w-[300px] h-[300px] rounded-full bg-[#00ff99] opacity-10 blur-[100px] top-[20%] left-[10%]'></div>
          <div className='absolute w-[300px] h-[300px] rounded-full bg-[#00e187] opacity-10 blur-[100px] bottom-[10%] right-[5%]'></div>

          <main className='text-center p-8 max-w-md relative z-10'>
            {/* Código de error */}
            <h1 className='text-9xl font-black bg-gradient-to-r from-[#00ff99] to-[#00e187] bg-clip-text text-transparent'>
              404
            </h1>

            <h2 className='text-2xl font-bold mt-4 mb-2'>
              Página no encontrada
            </h2>
            <p className='mb-8 opacity-80'>
              Lo sentimos, la página que estás buscando no existe o ha sido
              movida.
            </p>

            {/* Botones */}
            <div className='flex gap-4 justify-center flex-wrap'>
              <button
                onClick={() => window.history.back()}
                className='py-3 px-6 rounded-lg font-medium bg-[#2a2a32] text-white hover:bg-[#3a3a42] transition-colors'
              >
                Volver
              </button>
              <a
                href='/'
                className='py-3 px-6 rounded-lg font-medium bg-[#00ff99] text-[#121217] hover:bg-[#00e187] transition-colors'
              >
                Volver al inicio
              </a>
            </div>

            {/* Marca */}
            <div className='mt-16 animate-pulse'>
              <p className='font-bold text-xl'>Play Attention</p>
              <p className='text-sm opacity-60'>
                Mantente enfocado, mantente productivo
              </p>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
