/**
 * Servicio para crear un nuevo contacto (engagement) para un lead
 * Sigue el principio SRP al encargarse únicamente de la creación de contactos
 */

import { API_URL, handleResponseError } from './config';
import { engagementToApiAdapter } from '../../adapters/engagements.adapter';

/**
 * Crea un nuevo contacto para un lead
 * @param {Object} contactData Datos del contacto
 * @returns {Promise<Object>} Contacto creado
 */
export async function createEngagement(contactData) {
  try {
    // Adaptar los campos al formato esperado por la API usando el adaptador
    const payload = engagementToApiAdapter(contactData);

    const response = await fetch(`${API_URL}/engagements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await handleResponseError(response);
      throw new Error(errorText);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
