import fetchClient from './fetch-client';

/**
 * Actualiza el rol de un usuario existente en el sistema
 *
 * @param {string} userId - ID del usuario a actualizar
 * @param {string} role - Nuevo rol del usuario (ej: "User", "Admin", "Comercial")
 * @returns {Promise<Object>} - Promesa con la respuesta de la API
 */
export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetchClient.put(`/users/${userId}`, { role });

    return response;
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    throw error;
  }
};
