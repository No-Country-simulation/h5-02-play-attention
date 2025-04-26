/**
 * Cliente Fetch para solicitudes API
 */

const API_URL = 'https://play-attention.onrender.com/api';

/**
 * Cliente Fetch con configuración base
 */
const fetchClient = {
  /**
   * Método GET
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  /**
   * Método POST
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} data - Datos a enviar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  /**
   * Método PUT
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} data - Datos a enviar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  /**
   * Método DELETE
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise<any>} - Promesa con los datos de respuesta
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  }
};

export default fetchClient;
