/**
 * Utilidades de validación para la feature de leads
 * Contiene funciones para validar emails, teléfonos y datos de leads
 * Siguiendo el principio DRY (Don't Repeat Yourself)
 */

/**
 * Valida un correo electrónico
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si es válido
 */
export function isValidEmail(email) {
  if (!email) return false;

  // Regex básica para validar emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un número de teléfono
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} - true si es válido
 */
export function isValidPhone(phone) {
  if (!phone) return false;

  // Limpiamos el número para validarlo (quita espacios, guiones, etc)
  const cleanPhone = phone.replace(/\s+|-|\(|\)|\+/g, '');

  // Validamos que sean al menos 9 dígitos
  return /^\d{9,15}$/.test(cleanPhone);
}

/**
 * Valida datos básicos de un lead
 * @param {Object} leadData - Datos del lead
 * @returns {Object} - Resultado de validación { isValid, errors }
 */
export function validateLeadData(leadData) {
  const errors = {};

  // Validamos campos obligatorios
  if (!leadData.name || leadData.name.trim() === '') {
    errors.name = 'El nombre es obligatorio';
  }

  if (leadData.email && !isValidEmail(leadData.email)) {
    errors.email = 'El email no es válido';
  }

  if (leadData.phone && !isValidPhone(leadData.phone)) {
    errors.phone = 'El teléfono no es válido';
  }

  // Validamos que al menos tenga email o teléfono
  if (!leadData.email && !leadData.phone) {
    errors.contact = 'Debe especificar al menos un email o teléfono';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
