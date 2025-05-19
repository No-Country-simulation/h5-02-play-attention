/**
 * Adaptador para actividades del calendario del dashboard
 * Convierte los datos de actividades del calendario de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para actividades del calendario
 * @param {Object} apiActivitiesData - Datos crudos de actividades por día desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const calendarActivitiesAdapter = (apiActivitiesData = {}) => {
  // Si no hay datos, devolvemos un arreglo vacío
  if (!apiActivitiesData || !Object.keys(apiActivitiesData).length) return [];

  const result = [];

  // Iteramos sobre las claves (fechas) del objeto
  Object.keys(apiActivitiesData).forEach(dateKey => {
    const date = new Date(dateKey);
    const activities = apiActivitiesData[dateKey];

    // Si la fecha es válida, agregamos la entrada
    if (!isNaN(date.getTime())) {
      const weekday = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const day = date.getDate();

      result.push({
        date,
        weekday,
        day,
        activityCount:
          typeof activities === 'number' ? activities : activities.length,
        isToday: isToday(date),
        activities: Array.isArray(activities) ? activities : []
      });
    }
  });

  return result;
};

// Función auxiliar para verificar si una fecha es hoy
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
 