'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

/**
 * Componente reutilizable de spinner de carga con logo centrado y animaciones avanzadas
 *
 * @param {object} props - Propiedades del componente
 * @param {string} [props.text='Cargando'] - Texto a mostrar bajo el spinner
 * @param {string} [props.className] - Clases CSS adicionales para el contenedor
 * @param {string} [props.logoSrc='/img/logospinner.png'] - Ruta de la imagen del logo
 * @param {number} [props.size=36] - Tamaño del logo en px
 * @param {string} [props.spinnerColor='border-primary'] - Color del spinner
 * @param {boolean} [props.showText=true] - Si se debe mostrar el texto
 */
export function LoadingSpinner({
  text = 'Cargando',
  className,
  logoSrc = '/img/logospinner.png',
  size = 36,
  spinnerColor = 'border-primary',
  showText = true
}) {
  // Calcular tamaños relativos
  const logoSize = size;
  const spinnerSize = size * 1.8; // Spinner más grande para mejor visualización y centrado

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className='relative'>
        {/* Spinner principal exterior con rotación - Ahora con espacios (dash-array) */}
        <div className='relative'>
          <svg
            className='animate-spin'
            style={{
              width: `${spinnerSize}px`,
              height: `${spinnerSize}px`,
              animationDuration: '1.8s'
            }}
            viewBox='0 0 100 100'
          >
            <circle
              cx='50'
              cy='50'
              r='45'
              fill='none'
              strokeWidth='5'
              stroke='currentColor'
              className={cn('text-primary/20')}
            />
            <circle
              cx='50'
              cy='50'
              r='45'
              fill='none'
              strokeWidth='6'
              stroke='currentColor'
              strokeDasharray='70, 110'
              strokeLinecap='round'
              className={cn(
                'text-primary',
                spinnerColor.replace('border-', 'text-')
              )}
            />
          </svg>
        </div>

        {/* Halo de resplandor */}
        <div
          className='absolute inset-0 rounded-full animate-pulse'
          style={{
            width: `${spinnerSize}px`,
            height: `${spinnerSize}px`,
            background: `radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)`,
            animationDuration: '2.5s'
          }}
        />

        {/* Segundo spinner interior con dirección contraria */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <svg
            className='animate-reverse-spin'
            style={{
              width: `${spinnerSize * 0.75}px`,
              height: `${spinnerSize * 0.75}px`,
              animationDuration: '3.5s'
            }}
            viewBox='0 0 100 100'
          >
            <circle
              cx='50'
              cy='50'
              r='40'
              fill='none'
              strokeWidth='3'
              stroke='currentColor'
              strokeDasharray='40, 100'
              strokeLinecap='round'
              className={cn('text-primary/40')}
            />
          </svg>
        </div>

        {/* Logo centrado con animación de pulsación - Perfectamente centrado */}
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse'
          style={{
            animationDuration: '2.5s'
          }}
        >
          <div
            className='relative animate-logo-scale'
            style={{
              width: `${logoSize}px`,
              height: `${logoSize}px`
            }}
          >
            <Image
              src={logoSrc}
              alt='Logo'
              fill
              className='object-contain drop-shadow-md'
            />
          </div>
        </div>
      </div>

      {showText && (
        <p className='text-gray-500 mt-4 font-medium animate-pulse-text'>
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Variante simple de spinner sin logo
 */
export function Spinner({ className, size = 'default' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <Loader2
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )}
    />
  );
}

/**
 * Componente de pantalla completa para uso en carga de páginas
 */
export function FullPageLoading({ text = 'Cargando contenido' }) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'>
      <LoadingSpinner text={text} size={48} />
    </div>
  );
}

// Agregar estilos de animación personalizados al estilo global
if (typeof document !== 'undefined') {
  // Solo ejecutar en cliente para evitar errores SSR
  const style = document.createElement('style');
  style.textContent = `
    @keyframes reverse-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(-360deg);
      }
    }
    
    @keyframes logo-scale {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(0.9);
      }
    }
    
    @keyframes pulse-text {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
    
    .animate-reverse-spin {
      animation: reverse-spin 3s linear infinite;
    }
    
    .animate-logo-scale {
      animation: logo-scale 2s ease-in-out infinite;
    }
    
    .animate-pulse-text {
      animation: pulse-text 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}
