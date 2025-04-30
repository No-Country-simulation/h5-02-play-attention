'use client';

import { ServiceErrorDisplay } from './ServiceErrorDisplay';
import { InfoIcon } from 'lucide-react';

/**
 * Componente específico para mostrar mensaje de servicio no disponible
 * Variante simplificada del ServiceErrorDisplay con valores predeterminados
 */
export function ServiceUnavailable({
  title = 'Servicio temporalmente no disponible',
  message = 'Estamos realizando mejoras en nuestro sistema. Por favor, intente nuevamente más tarde.',
  featureName = 'servicio',
  onRetry,
  ...props
}) {
  // Personalizar mensaje según el feature si no se especifica
  const defaultTitle = `${
    featureName.charAt(0).toUpperCase() + featureName.slice(1)
  } temporalmente no disponible`;
  const defaultMessage = `Estamos realizando mejoras en el ${featureName}. Por favor, intente nuevamente más tarde.`;

  return (
    <ServiceErrorDisplay
      title={title || defaultTitle}
      message={message || defaultMessage}
      onRetry={onRetry}
      variant='warning'
      icon={InfoIcon}
      {...props}
    />
  );
}
