'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { AlertTriangle, RefreshCcw, ArrowLeft, Home } from 'lucide-react';

/**
 * Componente para mostrar mensajes de error cuando un servicio no está disponible
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del mensaje de error (ej: "Sistema de tickets no disponible")
 * @param {string} props.message - Mensaje descriptivo del error
 * @param {Function} props.onRetry - Función a ejecutar cuando se clickea el botón de reintentar
 * @param {Function} props.onBack - Función a ejecutar cuando se clickea el botón de volver
 * @param {string} props.backText - Texto para el botón de volver (ej: "Volver a la lista")
 * @param {string} props.retryText - Texto para el botón de reintentar (default: "Reintentar")
 * @param {string} props.homeText - Texto para el botón de inicio (default: "Ir al inicio")
 * @param {string} props.backPath - Ruta para el botón de volver (alternativa a onBack)
 * @param {string} props.homePath - Ruta para el botón de inicio (default: "/dashboard")
 * @param {Object} props.error - Objeto de error original (mostrado solo en desarrollo)
 * @param {string} props.variant - Variante de estilo ("warning", "error", default: "warning")
 * @param {React.ReactNode} props.icon - Icono personalizado
 */
export function ServiceErrorDisplay({
  title = 'Servicio temporalmente no disponible',
  message = 'Estamos realizando mejoras en nuestro sistema. Por favor, intente nuevamente más tarde.',
  onRetry,
  onBack,
  backText,
  retryText = 'Reintentar',
  homeText = 'Ir al inicio',
  backPath,
  homePath = '/dashboard',
  error,
  variant = 'warning',
  icon: CustomIcon
}) {
  const [showDetails, setShowDetails] = useState(false);

  // Definir los colores según la variante
  const colors = {
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      title: 'text-orange-800',
      text: 'text-orange-700',
      icon: 'text-orange-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'text-red-800',
      text: 'text-red-700',
      icon: 'text-red-500'
    }
  };

  const style = colors[variant] || colors.warning;

  // Determinar el ícono a mostrar
  const Icon = CustomIcon || AlertTriangle;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-6`}>
      <div className='flex items-start'>
        <div className='flex-shrink-0 mr-4'>
          <Icon className={`h-6 w-6 ${style.icon}`} />
        </div>
        <div className='flex-1'>
          <h3 className={`text-xl font-semibold ${style.title} mb-2`}>
            {title}
          </h3>
          <p className={`${style.text} mb-4`}>{message}</p>

          <div className='flex flex-wrap gap-3'>
            {onRetry && (
              <Button variant='outline' onClick={onRetry} size='sm'>
                <RefreshCcw className='mr-2 h-4 w-4' />
                {retryText}
              </Button>
            )}

            {(onBack || backPath) && (
              <Button
                variant='ghost'
                onClick={onBack}
                size='sm'
                href={!onBack ? backPath : undefined}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                {backText || 'Volver'}
              </Button>
            )}

            {homePath && (
              <Button variant='ghost' size='sm' href={homePath}>
                <Home className='mr-2 h-4 w-4' />
                {homeText}
              </Button>
            )}
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <div className='mt-6'>
              <Button
                variant='link'
                size='sm'
                onClick={() => setShowDetails(!showDetails)}
                className='px-0 text-gray-500 font-normal'
              >
                {showDetails
                  ? 'Ocultar detalles técnicos'
                  : 'Mostrar detalles técnicos'}
              </Button>

              {showDetails && (
                <div className='mt-2 p-4 bg-gray-100 rounded border border-gray-300'>
                  <p className='text-sm font-medium text-gray-700 mb-1'>
                    Error técnico:
                  </p>
                  <p className='text-sm text-gray-600 font-mono break-words'>
                    {error.message || JSON.stringify(error)}
                  </p>
                  {error.stack && (
                    <details className='mt-2'>
                      <summary className='text-sm font-medium text-gray-700 cursor-pointer'>
                        Stack trace
                      </summary>
                      <pre className='mt-1 text-xs text-gray-600 font-mono overflow-x-auto p-2 bg-gray-50 rounded'>
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
