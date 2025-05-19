'use client';

import { toast as sonnerToast } from 'sonner';

/**
 * Hook para utilizar toast notifications en la aplicación
 * Abstrae la implementación del toast para facilitar cambios futuros (OCP)
 */
export function useToast() {
  const toast = ({
    title,
    description,
    variant = 'default',
    duration = 5000,
    ...props
  }) => {
    const options = {
      ...props,
      duration
    };

    // Mapear variantes a tipos de toast de sonner
    if (variant === 'destructive') {
      return sonnerToast.error(title, {
        description,
        ...options
      });
    }

    if (variant === 'success') {
      return sonnerToast.success(title, {
        description,
        ...options
      });
    }

    if (variant === 'warning') {
      return sonnerToast.warning(title, {
        description,
        ...options
      });
    }

    if (variant === 'info') {
      return sonnerToast.info(title, {
        description,
        ...options
      });
    }

    // Default toast
    return sonnerToast(title, {
      description,
      ...options
    });
  };

  return { toast };
}
