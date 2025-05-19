import fetchClient from './fetch-client';

/**
 * Actualiza el estado de un usuario existente en el sistema
 *
 * @param {string} userId - ID del usuario a actualizar
 * @param {boolean} isActive - Estado del usuario (true para activo, false para inactivo)
 * @returns {Promise<Object>} - Promesa con la respuesta de la API
 */
export const updateUserStatus = async (userId, isActive) => {
  try {
    // Usar el método put del objeto fetchClient con la ruta correcta
    const response = await fetchClient.put(`/users/${userId}`, { isActive });

    return response;
  } catch (error) {
    console.error('Error al actualizar el estado del usuario:', error);
    throw error;
  }
};
