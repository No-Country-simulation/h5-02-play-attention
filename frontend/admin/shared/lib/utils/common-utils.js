import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind y resuelve conflictos
 * Esta función es utilizada por los componentes de shadcn/ui
 * @param {...string} inputs - Clases CSS a combinar
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
