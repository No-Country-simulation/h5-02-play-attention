/**
 * Constantes para los estados de leads
 * Centraliza la definición de estados para evitar inconsistencias
 */

// Estados usados en el frontend (UI)
export const FRONTEND_LEAD_STATUS = {
  NUEVO: 'nuevo',
  PROCESO: 'proceso',
  CLIENTE: 'cliente'
};

// Estados que espera el backend exactamente
export const BACKEND_LEAD_STATUS = {
  NUEVO: 'Nuevo',
  ACTIVO: 'Activo',
  CLIENTE: 'Cliente'
};

/**
 * Transforma un estado del frontend al formato esperado por el backend
 * @param {string} frontendStatus - Estado en formato frontend
 * @returns {string} - Estado en formato backend
 */
export const transformStatusToBackend = frontendStatus => {
  if (!frontendStatus) return BACKEND_LEAD_STATUS.NUEVO;

  const statusLower = frontendStatus.toLowerCase();

  if (statusLower === FRONTEND_LEAD_STATUS.NUEVO)
    return BACKEND_LEAD_STATUS.NUEVO;
  if (statusLower === FRONTEND_LEAD_STATUS.PROCESO)
    return BACKEND_LEAD_STATUS.ACTIVO;
  if (statusLower === FRONTEND_LEAD_STATUS.CLIENTE)
    return BACKEND_LEAD_STATUS.CLIENTE;

  return BACKEND_LEAD_STATUS.NUEVO; // Valor por defecto
};

/**
 * Transforma un estado del backend al formato usado en el frontend
 * @param {string} backendStatus - Estado en formato backend
 * @returns {string} - Estado en formato frontend
 */
export const transformStatusToFrontend = backendStatus => {
  if (!backendStatus) return FRONTEND_LEAD_STATUS.NUEVO;

  const statusLower = backendStatus.toLowerCase();

  if (statusLower === 'nuevo') return FRONTEND_LEAD_STATUS.NUEVO;
  if (statusLower === 'activo') return FRONTEND_LEAD_STATUS.PROCESO;
  if (statusLower === 'cliente') return FRONTEND_LEAD_STATUS.CLIENTE;

  return FRONTEND_LEAD_STATUS.NUEVO; // Valor por defecto
};
