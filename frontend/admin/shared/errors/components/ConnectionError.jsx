'use client';

import { ServiceErrorDisplay } from './ServiceErrorDisplay';
import { WifiOff } from 'lucide-react';

/**
 * Componente específico para mostrar mensaje de error de conexión
 * Variante del ServiceErrorDisplay para problemas de red
 */
export function ConnectionError({
  title = 'Error de conexión',
  message = 'No se ha podido establecer conexión con el servidor. Compruebe su conexión a internet e intente nuevamente.',
  onRetry,
  ...props
}) {
  return (
    <ServiceErrorDisplay
      title={title}
      message={message}
      onRetry={onRetry}
      variant='error'
      icon={WifiOff}
      retryText='Reintentar conexión'
      {...props}
    />
  );
}
