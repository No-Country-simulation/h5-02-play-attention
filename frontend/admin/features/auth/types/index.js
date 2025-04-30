/**
 * Tipos y modelos para la funcionalidad de autenticación
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - Email del usuario
 * @property {string} password - Contraseña del usuario
 */

/**
 * @typedef {Object} User
 * @property {string} id - ID del usuario
 * @property {string} email - Email del usuario
 * @property {string} role - Rol del usuario
 * @property {string} [name] - Nombre del usuario (opcional)
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success - Indica si la operación fue exitosa
 * @property {User} user - Datos del usuario
 */

/**
 * @typedef {Object} SessionState
 * @property {boolean} isAuthenticated - Indica si el usuario está autenticado
 * @property {User|null} user - Datos del usuario o null si no está autenticado
 * @property {boolean} isLoading - Indica si está cargando el estado de la sesión
 * @property {string|null} error - Error ocurrido, si lo hay
 */

export {};
