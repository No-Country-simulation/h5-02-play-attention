/**
 * Archivo de compatibilidad con importaciones antiguas
 * Re-exporta todas las funciones de la carpeta utils
 */

// Re-exportamos todo desde el directorio utils
export * from './utils/common-utils';
export * from './utils/color-utils';
export {
  getPageMetadata,
  default as pageMetadata
} from './utils/page-metadata';
