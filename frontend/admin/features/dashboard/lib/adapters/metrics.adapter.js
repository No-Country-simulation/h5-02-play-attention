/**
 * Adaptador para métricas del dashboard
 * Convierte los datos de la API al formato utilizado en los componentes UI
 * Sigue el principio de Responsabilidad Única (SRP)
 */

/**
 * Adaptador para métricas del dashboard
 * @param {Array} apiMetrics - Datos crudos de métricas desde la API
 * @returns {Array} - Datos formateados para el frontend
 */
export const metricsAdapter = (apiMetrics = []) => {
  if (!apiMetrics.length) return [];

  return apiMetrics.map(metric => ({
    title: metric.name || metric.title || '',
    value: metric.value || '0',
    change: metric.percentageChange
      ? `${metric.percentageChange > 0 ? '+' : ''}${metric.percentageChange}%`
      : '0%',
    trend:
      metric.trend ||
      (metric.percentageChange > 0
        ? 'up'
        : metric.percentageChange < 0
        ? 'down'
        : 'neutral'),
    icon: metric.icon || 'barChart', // Nombre del icono
    color: metric.color || 'gray',
    link: metric.link || '/'
  }));
};
