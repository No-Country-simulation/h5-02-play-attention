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
      // Transformación adaptada al formato exacto que funciona en Swagger
      const payload = {
        fullname: formData.name?.trim() || '',
        company: formData.company || '',
        phone: formData.phone || '',
        email: formData.email || '',
        service:
          formData.userType === 'persona'
            ? 'Individuo'
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

      console.log('========== CREATE LEAD API CALL ==========');
      console.log('URL:', `${API_URL}/leads`);
      console.log('Payload enviado:', JSON.stringify(payload, null, 2));
      console.log('Campos formData originales:', Object.keys(formData));
      console.log('Tipo de userType:', typeof formData.userType);
      console.log('Notas enviadas:', formData.notes);
      console.log('==========================================');

      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', responseHeaders);

      if (!response.ok) {
        let errorText = '';
        let errorJson = null;

        try {
          errorJson = await response.json();
          errorText = JSON.stringify(errorJson, null, 2);
          console.error('Error response JSON:', errorJson);
        } catch (parseError) {
          try {
            errorText = await response.text();
            console.error('Error response text:', errorText);
          } catch (textError) {
            errorText = 'No se pudo leer la respuesta de error';
            console.error('Error reading response:', textError);
          }
        }

        console.error('Response status:', response.status);
        console.error('Response status text:', response.statusText);

        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Lead created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error completo al crear lead:', error);
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
