/**
 * Archivo índice para exportar todas las utilidades
 * Facilita importaciones más limpias
 */

// Utilidades comunes
import { formatDate, formatCurrency, truncateText } from './common-utils';

// Utilidades de colores
import * as ColorUtils from './color-utils';

// Utilidades de metadatos
import { getPageMetadata } from './page-metadata';
import pageMetadata from './page-metadata';

// Dependencias externas para utilidades de UI
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función cn para combinar clases condicionalmente (usado por componentes shadcn)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Exportar todas las utilidades
export {
  formatDate,
  formatCurrency,
  truncateText,
  getPageMetadata,
  pageMetadata,
  ColorUtils
};
