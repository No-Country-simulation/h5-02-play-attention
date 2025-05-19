/**
 * Servicio para crear un nuevo lead
 * Sigue el principio SRP al encargarse únicamente de la creación de leads
 */

import {
  API_URL,
  mapSourceToBackend,
  mapUserTypeToService,
  handleResponseError
} from './config';

/**
 * Crea un nuevo lead
 * @param {Object} formData Datos del formulario
 * @returns {Promise<Object>} Lead creado
 */
export async function createLead(formData) {
  try {
    // Transformación adaptada al formato exacto que espera el backend
    const payload = {
      fullname: formData.name?.trim() || '',
      company: formData.company || '',
      phone: formData.phone || '',
      email: formData.email || '',
      service: mapUserTypeToService(formData.userType),
      notes: formData.notes || '',
      status: 'Nuevo',
      origen: mapSourceToBackend(formData.source) || 'Sitio web',
      relation: formData.position || 'Cantante',
      newsletter: formData.newsletter || false
    };

    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
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
