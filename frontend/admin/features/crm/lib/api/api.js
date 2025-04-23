/**
 * API centralizada para CRM
 * Contiene todas las funciones de comunicación con el backend en un solo lugar
 */

const API_URL = 'https://play-attention.onrender.com/api';

export const leadsApi = {
  /**
   * Obtiene todos los leads
   * @returns {Promise<Array>} Lista de leads
   */
  getLeads: async () => {
    try {
      console.log(`Fetching leads from: ${API_URL}/leads`);

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
      console.log(`Fetched ${data.length || 0} leads`);
      return data;
    } catch (error) {
      console.error('Error fetching leads:', error);
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
      console.error(`Error fetching lead ${id}:`, error);
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
      // Transformación simple e integrada
      const payload = {
        fullname: formData.name?.trim() || '',
        company: formData.userType === 'empresa' ? formData.company || '' : '',
        phone: formData.phone || '',
        email: formData.email || '',
        // Mapeamos userType a service según lo esperado por backend
        service:
          formData.userType === 'persona'
            ? 'Individuo'
            : formData.userType === 'profesional'
            ? 'Profesional'
            : formData.userType === 'empresa'
            ? 'Empresa'
            : 'Individuo',
        message: formData.notes || '',
        status: 'Nuevo',
        origen: formData.source || 'Sitio web',
        relation: formData.position || ''
      };

      console.log('Sending lead data to API:', payload);

      const response = await fetch(`${API_URL}/leads`, {
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

      const data = await response.json();
      console.log('Lead created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
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
      // Transformación similar a createLead
      const payload = {
        fullname: formData.name?.trim() || '',
        company: formData.userType === 'empresa' ? formData.company || '' : '',
        phone: formData.phone || '',
        email: formData.email || '',
        service:
          formData.userType === 'persona'
            ? 'Individuo'
            : formData.userType === 'profesional'
            ? 'Profesional'
            : formData.userType === 'empresa'
            ? 'Empresa'
            : 'Individuo',
        message: formData.notes || '',
        status: formData.status || 'Nuevo',
        origen: formData.source || 'Sitio web',
        relation: formData.position || ''
      };

      const response = await fetch(`${API_URL}/leads/${id}`, {
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

      return response.json();
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
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
      console.error(`Error deleting lead ${id}:`, error);
      throw error;
    }
  }
};
