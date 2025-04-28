/**
 * Archivo de barril (index) para APIs de contenido
 * Centraliza todas las exportaciones para facilitar la importación en componentes
 */

// Importar las funciones individuales
import { getContents } from './getContents';
import { getContentById } from './getContentById';
import { createContent } from './createContent';
import { updateContent } from './updateContent';
import { deleteContent } from './deleteContent';

// Mantener una estructura para compatibilidad con patrones existentes
export const contentsApi = {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent
};

// También exportar las funciones individuales para uso directo
export {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent
};
