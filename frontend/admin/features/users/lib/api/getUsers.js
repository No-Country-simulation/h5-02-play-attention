/**
 * API client para obtener usuarios del backend
 */
import fetchClient from './fetch-client';

/**
 * Obtiene todos los usuarios de la API
 * @returns {Promise<Object>} - Promesa que resuelve a los datos de usuarios
 */
export const getUsers = async () => {
  try {
    return await fetchClient.get('/users');
  } catch (error) {
    // Si el error es 404 y el mensaje indica que no existen usuarios,
    // devolvemos un objeto con estructura similar pero con un array vacío
    if (
      error.statusCode === 404 &&
      error.message?.includes('No existen usuarios')
    ) {
      return {
        data: [],
        total: 0,
        page: 1,
        totalPages: 1
      };
    }

    // Otros errores se propagan normalmente
    throw new Error(error.message || 'Error al obtener usuarios');
  }
};
