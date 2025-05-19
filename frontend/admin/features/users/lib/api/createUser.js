/**
 * API client para crear un nuevo usuario
 */
import fetchClient from './fetch-client';

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario a crear
 * @param {string} userData.email - Correo electrónico del usuario
 * @param {string} userData.password - Contraseña del usuario
 * @param {string} userData.role - Rol del usuario
 * @param {string} userData.service - Servicio del usuario (Individuo, Empresa, Profesional)
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del usuario creado
 */
export const createUser = async userData => {
  try {
    // Mapear los roles según lo que espera el backend
    const mappedRole = mapRole(userData.role);

    // Preparar datos para la API exactamente como el formato que espera el backend
    const apiData = {
      fullname: userData.fullname,
      email: userData.email,
      password: userData.password,
      role: mappedRole,
      service: userData.service
    };

    console.log('Enviando datos al backend:', apiData);

    const result = await fetchClient.post('/auth/register', apiData);
    console.log('Respuesta del backend:', result);
    return result;
  } catch (error) {
    console.error('Error completo:', error);
    throw new Error(error.message || 'Error al crear usuario');
  }
};

/**
 * Mapea el rol al formato esperado por el backend
 * @param {string} role - Rol del usuario en la interfaz
 * @returns {string} - Rol en el formato del backend
 */
function mapRole(role) {
  switch (role) {
    case 'Usuario':
      return 'User';
    case 'Administrador':
      return 'Admin';
    case 'Comercial':
      return 'Comercial';
    default:
      return 'User';
  }
}
