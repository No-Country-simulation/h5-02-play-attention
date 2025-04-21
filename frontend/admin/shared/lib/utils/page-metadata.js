/**
 * Configuración central de metadatos para todas las páginas de la aplicación
 * Esto permite mantener consistencia en títulos y descripciones
 * y facilita cambios globales desde un solo lugar
 */

const pageMetadata = {
  dashboard: {
    title: 'Panel de Control',
    description: 'Vista general del sistema y acciones rápidas'
  },
  leads: {
    title: 'Gestión de Leads',
    description:
      'Administra tus leads, filtra por estado y visualiza su información'
  },
  users: {
    title: 'Gestión de Usuarios',
    description: 'Administra usuarios, permisos y roles del sistema'
  },
  content: {
    title: 'Contenido',
    description: 'Gestiona el contenido educativo y material de la plataforma'
  },
  tickets: {
    title: 'Tickets de Soporte',
    description:
      'Visualiza y responde a las solicitudes de soporte de los usuarios'
  },
  notifications: {
    title: 'Notificaciones',
    description: 'Gestiona las notificaciones y comunicaciones con los usuarios'
  },
  roles: {
    title: 'Permisos y Roles',
    description: 'Configura los permisos y roles del sistema'
  },
  settings: {
    title: 'Configuración',
    description: 'Ajusta la configuración general de la plataforma'
  }
};

/**
 * Obtiene los metadatos de una página específica
 * @param {string} page - Clave de la página
 * @returns {Object} - Título y descripción
 */
export function getPageMetadata(page) {
  return (
    pageMetadata[page] || {
      title: 'Play Attention Admin',
      description: 'Panel de administración de la plataforma'
    }
  );
}

export default pageMetadata;
