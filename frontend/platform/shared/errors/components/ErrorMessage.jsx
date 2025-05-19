'use client';

/**
 * Componente para mostrar mensajes descriptivos de error
 * Sigue el principio de Inyección de Dependencias (DIP) de SOLID
 * Permite personalizar el mensaje a través de props
 */
export const ErrorMessage = ({
  title = 'Página no encontrada',
  message = 'Lo sentimos, la página que estás buscando no existe o ha sido movida.'
}) => {
  return (
    <>
      <h1 className='mb-4 text-3xl font-bold tracking-tight text-white'>
        {title}
      </h1>

      <p className='mb-8 text-lg text-gray-300'>{message}</p>
    </>
  );
};
