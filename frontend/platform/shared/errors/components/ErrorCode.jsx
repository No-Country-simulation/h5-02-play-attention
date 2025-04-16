'use client';

/**
 * Componente para mostrar el código de error con efectos visuales
 * Sigue el principio de Open/Closed (OCP) de SOLID permitiendo extensión sin modificación
 */
export const ErrorCode = ({ code = '404' }) => {
  return (
    <div className='mb-6 flex justify-center'>
      <div className='relative'>
        <div className='text-[180px] font-black text-white leading-none'>
          <span className='sr-only'>Error</span>
          <span className='bg-gradient-to-r from-[#1282a2] to-[#034078] bg-clip-text text-transparent'>
            {code}
          </span>
        </div>
        <div className='absolute -inset-4 opacity-50 blur-lg rounded-full bg-gradient-to-r from-[#1282a220] to-[#03407820]'></div>
      </div>
    </div>
  );
};
