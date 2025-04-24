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

      // Asegurarnos que todos los campos requeridos estén presentes
      const payload = {
        fullname:
          formData.name?.trim() || formData.fullname || 'Nombre temporal',
        phone: formData.phone || '123456789', // Asegurar que phone no esté vacío
        email: formData.email || 'correo@ejemplo.com', // Asegurar un email válido
        company: formData.company || '',
        service:
          formData.service ||
          (formData.userType === 'persona'
            ? 'Individuo'
            : formData.userType === 'profesional'
            ? 'Profesional'
            : formData.userType === 'empresa'
            ? 'Empresa'
            : 'Individuo'),
        message: formData.notes || formData.message || '',
        status: formData.status || 'Nuevo',
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
