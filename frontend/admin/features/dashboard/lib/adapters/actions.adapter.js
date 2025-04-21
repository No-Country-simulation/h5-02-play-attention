/**
 * Adaptador para acciones rápidas del dashboard
 * Convierte los datos de acciones de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para acciones rápidas
 * @param {Array} apiActions - Datos crudos de acciones desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const actionsAdapter = (apiActions = []) => {
  if (!apiActions.length) return [];

  // Mapeo de tipos a iconos para acciones
  const typeToIconMap = {
    user: 'userPlus',
    ticket: 'ticketCheck',
    content: 'fileText',
    event: 'clock',
    system: 'bell',
    default: 'userPlus'
  };

  return apiActions.map(action => {
    // Determinar qué icono usar
    let iconName = 'userPlus'; // valor por defecto

    if (action.icon) {
      // Si ya viene un icon string, usamos ese
      iconName = action.icon;
    } else if (action.type) {
      // Si no hay icono pero hay tipo, mapeamos el tipo a un icono
      iconName = typeToIconMap[action.type] || typeToIconMap.default;
    }

    return {
      title: action.title || action.name || '',
      description: action.description || '',
      icon: iconName,
      color: action.color || 'green',
      link: action.link || action.url || '/'
    };
  });
};
