/**
 * Adaptador para perfiles de usuario
 * Convierte los datos de perfiles de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para perfiles
 * @param {Object} apiProfile - Datos crudos del perfil desde la API
 * @returns {Object} - Datos de perfil formateados para el frontend
 */
export const profileAdapter = (apiProfile = {}) => {
  if (!apiProfile || !apiProfile.id) return null;

  return {
    id: apiProfile.id || '',
    username: apiProfile.id_string || '', // Campo 'id_string' según el diagrama
    fullName: apiProfile.id_string || '', // Usamos el mismo valor como nombre completo
    email: '', // No hay campo de email en la entidad Profile
    avatar: '', // No hay campo de avatar en la entidad Profile
    role: determineUserRole(apiProfile),
    isActive: apiProfile.isActive || false,
    lastActive: new Date().toISOString(), // No hay campo de última actividad en la entidad Profile
    // Datos adicionales específicos del perfil
    access: apiProfile.access || '',
    password: '********' // Nunca mostrar la contraseña real, solo un placeholder
  };
};

/**
 * Adaptador para lista de perfiles
 * @param {Array} apiProfiles - Lista de perfiles desde la API
 * @returns {Array} - Lista de perfiles formateados para el frontend
 */
export const profilesListAdapter = (apiProfiles = []) => {
  if (!apiProfiles.length) return [];

  return apiProfiles.map(profile => ({
    id: profile.id || '',
    username: profile.id_string || '',
    isActive: profile.isActive || false,
    role: determineUserRole(profile),
    access: profile.access || '',
    lastActive: new Date().toISOString() // No hay campo de última actividad en la entidad Profile
  }));
};

/**
 * Determina el rol del usuario basado en datos del perfil
 * @param {Object} profile - Datos del perfil
 * @returns {string} - Rol determinado
 */
function determineUserRole(profile) {
  // Como no hay campo explícito de rol, podríamos deducirlo de otros campos
  // Por ejemplo, según el nivel de acceso

  if (profile.access === 'admin') return 'Administrador';
  if (profile.access === 'editor') return 'Editor';
  if (profile.access === 'viewer') return 'Visualizador';

  return 'Usuario';
}
 