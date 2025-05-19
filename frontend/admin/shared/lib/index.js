/**
 * Archivo índice principal para re-exportar todas las utilidades
 * Facilita importaciones más limpias desde cualquier parte de la aplicación
 */

export * from './utils';
export * from './services';

// Re-exportamos directamente cn para mantener compatibilidad con importaciones existentes
export { cn } from './utils/common-utils';

// Re-exportamos funciones de metadatos para mantener compatibilidad con importaciones existentes
export {
  getPageMetadata,
  default as pageMetadata
} from './utils/page-metadata';
