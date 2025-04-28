/**
 * Servicio para actualizar un lead existente
 * Sigue el principio SRP al encargarse únicamente de la actualización de leads
 */

import {
  API_URL,
  mapSourceToBackend,
  mapUserTypeToService,
  handleResponseError
} from './config';

/**
 * Actualiza un lead existente
 * @param {string} id ID del lead
 * @param {Object} formData Datos actualizados
 * @returns {Promise<Object>} Lead actualizado
 */
export async function updateLead(id, formData) {
  try {
    // Validación estricta del ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`ID del lead inválido: "${id}"`);
    }

    // El estado ya viene en formato correcto desde los componentes
    const payload = {
      fullname: formData.name?.trim() || formData.fullname || 'Nombre temporal',
      phone: formData.phone || '123456789', // Asegurar que phone no esté vacío
      email: formData.email || 'correo@ejemplo.com', // Asegurar un email válido
      company: formData.company || '',
      service:
        formData.service ||
        (formData.userType
          ? mapUserTypeToService(formData.userType)
          : 'Persona individual'),
      notes: formData.notes || formData.message || '',
      status: formData.status, // El estado ya viene en formato correcto
      origen:
        mapSourceToBackend(formData.source || formData.origen) || 'Sitio web',
      relation: formData.position || formData.relation || 'Usuario' // Asegurar que relation no esté vacío
    };

    const url = `${API_URL}/leads/${id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
