/**
 * API para leads
 * Centraliza todas las llamadas a la API relacionadas con leads
 */

const API_URL = 'https://play-attention.onrender.com/api';
import { engagementToApiAdapter } from '../adapters/engagements.adapter';

export const leadsApi = {
  /**
   * Obtiene todos los leads
   * @returns {Promise<Array>} Lista de leads
   */
  getLeads: async () => {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache'
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene un lead por su ID
   * @param {string} id ID del lead
   * @returns {Promise<Object>} Datos del lead
   */
  getLeadById: async id => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea un nuevo lead
   * @param {Object} formData Datos del formulario
   * @returns {Promise<Object>} Lead creado
   */
  createLead: async formData => {
    try {
      // Transformación adaptada al formato exacto que funciona en Swagger
      const payload = {
        fullname: formData.name?.trim() || '',
        company: formData.company || '',
        phone: formData.phone || '',
        email: formData.email || '',
        service:
          formData.userType === 'persona'
            ? 'Persona Individual'
            : formData.userType === 'profesional'
            ? 'Profesional'
            : 'Empresa',
        notes: formData.notes || '',
        status: 'Nuevo',
        origen: formData.source || 'Otro',
        relation: formData.position || 'Cantante'
      };

      // Asegurarnos que los campos coincidan exactamente con lo que espera el backend
      // Esto es crítico para evitar el error 500

      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      if (!response.ok) {
        let errorText = '';
        let errorJson = null;

        try {
          errorJson = await response.json();
          errorText = JSON.stringify(errorJson, null, 2);
        } catch (parseError) {
          try {
            errorText = await response.text();
          } catch (textError) {
            errorText = 'No se pudo leer la respuesta de error';
          }
        }

        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza un lead existente
   * @param {string} id ID del lead
   * @param {Object} formData Datos actualizados
   * @returns {Promise<Object>} Lead actualizado
   */
  updateLead: async (id, formData) => {
    try {
      // Validación estricta del ID
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error(`ID del lead inválido: "${id}"`);
      }

      // El estado ya viene en formato correcto desde los componentes
      const payload = {
        fullname:
          formData.name?.trim() || formData.fullname || 'Nombre temporal',
        phone: formData.phone || '123456789', // Asegurar que phone no esté vacío
        email: formData.email || 'correo@ejemplo.com', // Asegurar un email válido
        company: formData.company || '',
        service:
          formData.service ||
          (formData.userType === 'persona'
            ? 'Persona Individual'
            : formData.userType === 'profesional'
            ? 'Profesional'
            : formData.userType === 'empresa'
            ? 'Empresa'
            : 'Persona Individual'),
        notes: formData.notes || formData.message || '',
        status: formData.status, // El estado ya viene en formato correcto
        origen: formData.source || formData.origen || 'Sitio web',
        relation: formData.position || formData.relation || 'Usuario' // Asegurar que relation no esté vacío
      };

      const url = `${API_URL}/leads/${id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorText = '';
        try {
          const errorResponse = await response.json();
          errorText = JSON.stringify(errorResponse);
        } catch (parseError) {
          errorText = await response.text();
        }
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Elimina un lead
   * @param {string} id ID del lead a eliminar
   * @returns {Promise<Object>} Confirmación
   */
  deleteLead: async id => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        let errorText = '';
        try {
          const errorResponse = await response.json();
          errorText = JSON.stringify(errorResponse);
        } catch (parseError) {
          errorText = await response.text();
        }
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }
};

/**
 * API para engagements (contactos con leads)
 * Centraliza todas las llamadas a la API relacionadas con contactos
 */
export const engagementsApi = {
  /**
   * Obtiene los contactos de un lead específico
   * @param {string} leadId ID del lead
   * @returns {Promise<Array>} Lista de contactos
   */
  getLeadEngagements: async leadId => {
    try {
      console.log(`Fetching engagements for lead: ${leadId}`);
      const url = `${API_URL}/engagements/lead/${leadId}`;
      console.log(`Request URL: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        console.error(
          `Error fetching engagements: ${response.status}`,
          errorText
        );
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Engagements API response:', data);
      return data;
    } catch (error) {
      console.error('Error in getLeadEngagements:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo contacto para un lead
   * @param {Object} contactData Datos del contacto
   * @returns {Promise<Object>} Contacto creado
   */
  createEngagement: async contactData => {
    try {
      // Adaptar los campos al formato esperado por la API usando el adaptador
      const payload = engagementToApiAdapter(contactData);

      const response = await fetch(`${API_URL}/engagements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorText = '';
        try {
          const errorResponse = await response.json();
          errorText = JSON.stringify(errorResponse);
        } catch (parseError) {
          errorText = await response.text();
        }
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Mapea el tipo de contacto del frontend al formato de la API
 * @param {string} type Tipo de contacto en el frontend
 * @returns {string} Tipo de contacto para la API
 */
function mapContactTypeToApi(type) {
  const typeMap = {
    email: 'email',
    call: 'phonecall',
    meeting: 'meeting',
    message: 'whatsapp',
    note: 'other'
  };

  return typeMap[type] || 'other';
}
