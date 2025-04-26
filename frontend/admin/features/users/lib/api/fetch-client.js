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
        // Parse el cuerpo de la respuesta para obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));

        // Crear un objeto de error mejorado
        const error = new Error(
          errorData.message || `Error: ${response.status}`
        );
        error.statusCode = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
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
      console.log(`Enviando POST a ${API_URL}${endpoint} con datos:`, data);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      console.log(`Respuesta de ${endpoint}:`, responseData);

      // Si la respuesta no es ok (código 4xx o 5xx)
      if (!response.ok) {
        // Extraer mensaje de error del cuerpo de la respuesta
        let errorMessage = 'Error de servidor';

        // Buscar el mensaje en varias posibles ubicaciones
        if (responseData.response && responseData.response.message) {
          errorMessage = responseData.response.message;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }

        const error = new Error(errorMessage);
        error.statusCode = response.status;
        error.data = responseData;
        throw error;
      }

      // Verificar si hay un mensaje de error en la respuesta aunque el código sea 200
      if (
        responseData.error ||
        (responseData.message &&
          typeof responseData.message === 'string' &&
          (responseData.message.toLowerCase().includes('error') ||
            responseData.message.includes('ya registrado')))
      ) {
        let errorMessage =
          responseData.message || responseData.error || 'Error en la respuesta';

        const error = new Error(errorMessage);
        error.statusCode = response.status;
        error.data = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
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
        // Parse el cuerpo de la respuesta para obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));

        // Crear un objeto de error mejorado
        const error = new Error(
          errorData.message || `Error: ${response.status}`
        );
        error.statusCode = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
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
        // Parse el cuerpo de la respuesta para obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));

        // Crear un objeto de error mejorado
        const error = new Error(
          errorData.message || `Error: ${response.status}`
        );
        error.statusCode = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Si ya es un error estructurado, lo propagamos
      if (error.statusCode) {
        throw error;
      }

      // De lo contrario, creamos un error genérico
      console.error('Fetch Error:', error);
      throw error;
    }
  }
};

export default fetchClient;
