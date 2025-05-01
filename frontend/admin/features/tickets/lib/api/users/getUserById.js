/**
 * API para obtener información de un usuario por su ID
 * Implementa la consulta GET a la API de usuarios
 */

import { API_URL, commonHeaders, handleResponseError } from '../config';

/**
 * Obtiene información detallada de un usuario por su ID
 * @param {string} userId - ID del usuario a consultar
 * @returns {Promise<Object>} - Información del usuario
 */
export async function getUserById(userId) {
  try {
    if (!userId) {
      console.warn('getUserById: ID de usuario vacío o nulo');
      throw new Error('El ID del usuario es obligatorio');
    }

    // Log para debugging
    console.log(
      `[DEBUG] getUserById: Intentando obtener usuario con ID: "${userId}"`
    );

    const url = `${API_URL}/users/${userId}`;

    console.log(`Obteniendo información del usuario ${userId} desde: ${url}`);

    // Realizar la petición
    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders,
      credentials: 'include'
    });

    // Log detallado de la respuesta HTTP
    console.log(`[DEBUG] getUserById: Respuesta HTTP para usuario ${userId}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[ERROR] getUserById: Error HTTP ${response.status} para usuario ${userId}:`,
        errorText
      );
      throw new Error(await handleResponseError(response));
    }

    const data = await response.json();
    console.log(
      '[DEBUG] getUserById: Datos recibidos:',
      JSON.stringify(data, null, 2)
    );

    // Verificar estructura de los datos
    if (!data || Object.keys(data).length === 0) {
      console.warn(`[WARN] getUserById: Datos vacíos para usuario ${userId}`);
      return {
        id: userId,
        fullname: 'Usuario sin datos',
        email: ''
      };
    }

    return data;
  } catch (error) {
    console.error(
      `[ERROR] getUserById: Error al obtener información del usuario ${userId}:`,
      error
    );

    // Devolvemos un objeto con información mínima en caso de error
    return {
      id: userId,
      fullname: 'Usuario desconocido',
      email: '',
      error: error.message
    };
  }
}
