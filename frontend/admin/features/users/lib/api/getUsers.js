/**
 * API client para obtener usuarios del backend
 */
import fetchClient from './fetch-client';

/**
 * Obtiene usuarios de la API con paginación y filtros
 * @param {Object} options - Opciones de paginación y filtrado
 * @param {number} options.page - Número de página (por defecto 1)
 * @param {number} options.limit - Límite de resultados por página (por defecto 10)
 * @param {string} options.status - Filtro por estado (active, inactive, o all)
 * @param {string} options.search - Término de búsqueda para filtrar resultados
 * @returns {Promise<Object>} - Promesa que resuelve a los datos de usuarios
 */
export const getUsers = async ({
  page = 1,
  limit = 10,
  status = 'all',
  search = ''
} = {}) => {
  try {
    // Construir parámetros de la URL
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    // Añadir filtros opcionales si están presentes
    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (search) {
      params.append('search', search);
    }

    return await fetchClient.get(`/users?${params.toString()}`);
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
