import { API_ENDPOINTS, fetchConfig } from '@/shared/lib/api/config';
import { getAuthTokenFromCookie } from '@/features/support/lib/utils/cookies';

/**
 * Obtiene los datos de un usuario por su ID
 * @param {string} userId - ID del usuario a consultar
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserById = async userId => {
  try {
    // Obtener el token de autenticación
    const token = getAuthTokenFromCookie();

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Realizar la petición al API
    const response = await fetch(API_ENDPOINTS.users.getById(userId), {
      method: 'GET',
      headers: {
        ...fetchConfig.defaultOptions.headers,
        ...fetchConfig.authHeaders(token)
      }
    });

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al obtener usuario: ${response.status}`
      );
    }

    // Devolver los datos del usuario
    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    throw error;
  }
};

/**
 * Actualiza los datos de un usuario
 * @param {string} userId - ID del usuario a actualizar
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} Datos del usuario actualizados
 */
export const updateUserById = async (userId, userData) => {
  try {
    // Obtener el token de autenticación
    const token = getAuthTokenFromCookie();

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Mapear los datos del formulario al formato esperado por el API
    const apiData = {
      fullname: userData.name,
      email: userData.email,
      service: userData.profession,
      contact_id: userData.phone || null,
      relation: userData.organization || null
    };

    // Realizar la petición al API
    const response = await fetch(API_ENDPOINTS.users.update(userId), {
      method: 'PUT',
      headers: {
        ...fetchConfig.defaultOptions.headers,
        ...fetchConfig.authHeaders(token)
      },
      body: JSON.stringify(apiData)
    });

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar usuario: ${response.status}`
      );
    }

    // Devolver los datos del usuario
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    throw error;
  }
};
