/**
 * API client para obtener usuarios del backend
 */
import fetchClient from './fetch-client';

/**
 * Obtiene todos los usuarios de la API
 * No usa paginación para permitir ordenamiento y filtrado correcto en el cliente
 * @returns {Promise<Array>} - Promesa que resuelve al array de usuarios
 */
export const getUsers = async () => {
  try {
    const response = await fetchClient.get('/users');
    return response.data || [];
  } catch (error) {
    if (
      error.statusCode === 404 &&
      error.message?.includes('No existen usuarios')
    ) {
      return [];
    }
    throw new Error(error.message || 'Error al obtener usuarios');
  }
};
