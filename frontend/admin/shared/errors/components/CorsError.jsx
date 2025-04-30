'use client';

import { ServiceErrorDisplay } from './ServiceErrorDisplay';
import { Globe } from 'lucide-react';

/**
 * Componente específico para mostrar mensaje de error CORS
 * Variante del ServiceErrorDisplay para problemas de acceso entre dominios
 */
export function CorsError({
  title = 'Error de acceso al servicio',
  message = 'No se puede acceder al servicio debido a restricciones de seguridad entre dominios (CORS). Este problema está siendo solucionado por nuestro equipo técnico.',
  onRetry,
  ...props
}) {
  // Función que detecta si el error es de tipo CORS
  const isCorsError = error => {
    if (!error) return false;

    // Mensajes típicos de errores CORS
    const corsMessages = [
      'Access to fetch',
      'has been blocked by CORS policy',
      'CORS policy',
      'origin not allowed',
      'cross-origin request',
      'credentials mode',
      'Access-Control-Allow-Origin'
    ];

    const errorMessage =
      typeof error === 'string'
        ? error
        : error.message || JSON.stringify(error);

    return corsMessages.some(msg => errorMessage.includes(msg));
  };

  return (
    <ServiceErrorDisplay
      title={title}
      message={message}
      onRetry={onRetry}
      variant='error'
      icon={Globe}
      retryText='Reintentar conexión'
      {...props}
    />
  );
}
