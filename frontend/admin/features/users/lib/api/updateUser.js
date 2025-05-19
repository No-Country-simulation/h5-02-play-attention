import fetchClient from './fetch-client';

/**
 * Actualiza los datos generales de un usuario existente en el sistema
 *
 * @param {string} userId - ID del usuario a actualizar
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} - Promesa con la respuesta de la API
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetchClient.put(`/users/${userId}`, userData);
    return response;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};
