/**
 * Servicio para obtener los contactos (engagements) de un lead
 * Sigue el principio SRP al encargarse únicamente de obtener los contactos de un lead específico
 */

import { API_URL, commonHeaders } from './config';

/**
 * Obtiene los contactos de un lead específico
 * @param {string} leadId ID del lead
 * @returns {Promise<Array>} Lista de contactos
 */
export async function getLeadEngagements(leadId) {
  try {
    const url = `${API_URL}/engagements/lead/${leadId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getLeadEngagements:', error);
    throw error;
  }
}
