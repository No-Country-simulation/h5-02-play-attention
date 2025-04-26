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
    // Preparar datos para la API exactamente como el formato que funcionó en Postman
    const apiData = {
      email: userData.email,
      password: userData.password,
      role: userData.role === 'Usuario' ? 'User' : userData.role,
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
 * Mapea el rol de usuario a un tipo de servicio
 * @param {string} role - Rol del usuario
 * @returns {string} - Servicio mapeado
 */
function mapServiceType(role) {
  switch (role) {
    case 'Admin':
      return 'System';
    case 'Comercial':
      return 'Comercial';
    case 'Usuario':
    default:
      return 'Individuo';
  }
}

/**
 * Mapea el rol al formato esperado por el backend
 * @param {string} role - Rol del usuario en la interfaz
 * @returns {string} - Rol en el formato del backend
 */
function mapRole(role) {
  switch (role) {
    case 'Usuario':
      return 'User';
    case 'Admin':
      return 'Admin';
    case 'Comercial':
      return 'Comercial';
    default:
      return 'User';
  }
}
