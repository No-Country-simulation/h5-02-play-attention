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
    console.log('[getUsers] Solicitando usuarios a la API...');
    const response = await fetchClient.get('/users');

    // Verificar la estructura de la respuesta
    console.log('[getUsers] Respuesta completa:', response);

    // Determinar de qué manera están almacenados los usuarios en la respuesta
    let users = [];

    if (response && response.data && Array.isArray(response.data)) {
      // Formato típico: { data: [...] }
      users = response.data;
      console.log(
        '[getUsers] Usuarios encontrados en response.data:',
        users.length
      );
    } else if (Array.isArray(response)) {
      // La respuesta es directamente un array
      users = response;
      console.log(
        '[getUsers] La respuesta es directamente un array:',
        users.length
      );
    } else {
      // Buscar recursivamente en la respuesta cualquier array que pueda contener usuarios
      const findUsersArray = obj => {
        if (!obj || typeof obj !== 'object') return null;

        // Buscar propiedades que puedan contener el array de usuarios
        for (const key in obj) {
          if (Array.isArray(obj[key])) {
            // Si es un array, verificar la primera entrada para ver si tiene propiedades esperadas de un usuario
            if (
              obj[key].length > 0 &&
              typeof obj[key][0] === 'object' &&
              (obj[key][0]._id || obj[key][0].fullname || obj[key][0].email)
            ) {
              console.log(
                `[getUsers] Usuarios encontrados en response.${key}:`,
                obj[key].length
              );
              return obj[key];
            }
          } else if (typeof obj[key] === 'object') {
            // Si es un objeto, buscar recursivamente
            const result = findUsersArray(obj[key]);
            if (result) return result;
          }
        }
        return null;
      };

      const usersArray = findUsersArray(response);
      if (usersArray) {
        users = usersArray;
      } else {
        console.warn(
          '[getUsers] No se pudo encontrar un array de usuarios en la respuesta'
        );
      }
    }

    // Verificar que realmente tenemos usuarios con la estructura esperada
    if (users.length > 0) {
      console.log('[getUsers] Primer usuario encontrado:', users[0]);

      // Verificar que los usuarios tienen las propiedades necesarias
      const validUsers = users.filter(user => {
        if (!user || typeof user !== 'object') return false;
        // Verificar ID y al menos un identificador de nombre
        return (
          (user._id || user.id) && (user.fullname || user.name || user.email)
        );
      });

      if (validUsers.length < users.length) {
        console.warn(
          `[getUsers] ${
            users.length - validUsers.length
          } usuarios no válidos fueron filtrados`
        );
        users = validUsers;
      }
    }

    console.log(`[getUsers] Total usuarios retornados: ${users.length}`);
    return users;
  } catch (error) {
    console.error('[getUsers] Error al obtener usuarios:', error);

    if (
      error.statusCode === 404 &&
      error.message?.includes('No existen usuarios')
    ) {
      console.log('[getUsers] No se encontraron usuarios (404)');
      return [];
    }
    throw new Error(error.message || 'Error al obtener usuarios');
  }
};
