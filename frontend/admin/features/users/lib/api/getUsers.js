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
    throw new Error(error.message || 'Error al obtener usuarios');
  }
};
