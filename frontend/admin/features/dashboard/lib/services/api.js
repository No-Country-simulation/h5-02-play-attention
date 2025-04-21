/**
 * Servicios para la comunicación con el backend
 * Siguiendo el patrón Repository y Clean Architecture
 */

import {
  metricsAdapter,
  alertsAdapter,
  actionsAdapter,
  leadsAdapter,
  ticketsAdapter,
  contentActivitiesAdapter,
  calendarActivitiesAdapter
} from '../adapters';

import {
  dashboardMetrics,
  overviewAlerts,
  quickActions,
  recentLeads,
  recentTickets,
  contentActivities
} from '../config/mockedData';

// Constante para el BaseURL de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.playattention.com';

/**
 * Obtiene las métricas para el dashboard
 * @returns {Promise<Array>} - Métricas del dashboard
 */
export async function fetchDashboardMetrics() {
  try {
    // Cuando exista el endpoint:
    // const response = await fetch(`${API_BASE_URL}/api/dashboard/metrics`);
    // if (!response.ok) throw new Error('Error fetching dashboard metrics');
    // return await response.json();

    // Mientras tanto, usar datos mock
    return Promise.resolve(dashboardMetrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // Fallback a datos mock en caso de error
    return dashboardMetrics;
  }
}

/**
 * Obtiene las alertas para el dashboard
 * @returns {Promise<Array>} - Alertas del dashboard
 */
export async function fetchDashboardAlerts() {
  try {
    // Cuando exista el endpoint:
    // const response = await fetch(`${API_BASE_URL}/api/dashboard/alerts`);
    // if (!response.ok) throw new Error('Error fetching dashboard alerts');
    // return await response.json();

    // Mientras tanto, usar datos mock
    return Promise.resolve(overviewAlerts);
  } catch (error) {
    console.error('Error fetching dashboard alerts:', error);
    // Fallback a datos mock en caso de error
    return overviewAlerts;
  }
}

/**
 * Obtiene las acciones rápidas para el dashboard
 * @returns {Promise<Array>} - Acciones rápidas
 */
export async function fetchQuickActions() {
  try {
    // Cuando exista el endpoint:
    // const response = await fetch(`${API_BASE_URL}/api/dashboard/quick-actions`);
    // if (!response.ok) throw new Error('Error fetching quick actions');
    // return await response.json();

    // Mientras tanto, usar datos mock
    return Promise.resolve(quickActions);
  } catch (error) {
    console.error('Error fetching quick actions:', error);
    // Fallback a datos mock en caso de error
    return quickActions;
  }
}

/**
 * Obtiene los leads recientes
 * @param {number} limit - Cantidad de leads a obtener
 * @returns {Promise<Array>} - Leads recientes
 */
export async function fetchRecentLeads(limit = 5) {
  try {
    // Cuando exista el endpoint:
    // const response = await fetch(`${API_BASE_URL}/api/leads/recent?limit=${limit}`);
    // if (!response.ok) throw new Error('Error fetching recent leads');
    // return await response.json();

    // Mientras tanto, usar datos mock
    return Promise.resolve(recentLeads.slice(0, limit));
  } catch (error) {
    console.error('Error fetching recent leads:', error);
    // Fallback a datos mock en caso de error
    return recentLeads.slice(0, limit);
  }
}

/**
 * Obtiene los tickets recientes
 * @param {number} limit - Cantidad de tickets a obtener
 * @returns {Promise<Array>} - Tickets recientes
 */
export async function fetchRecentTickets(limit = 5) {
  try {
    // Cuando exista el endpoint:
    // const response = await fetch(`${API_BASE_URL}/api/tickets/recent?limit=${limit}`);
    // if (!response.ok) throw new Error('Error fetching recent tickets');
    // return await response.json();

    // Mientras tanto, usar datos mock
    return Promise.resolve(recentTickets.slice(0, limit));
  } catch (error) {
    console.error('Error fetching recent tickets:', error);
    // Fallback a datos mock en caso de error
    return recentTickets.slice(0, limit);
  }
}

/**
 * Obtiene las actividades de contenido recientes
 * @param {number} limit - Cantidad de actividades a obtener
 * @returns {Promise<Array>} - Actividades de contenido
 */
export async function fetchContentActivities(limit = 4) {
  try {
    // Cuando exista el endpoint:
    // const response = await fetch(`${API_BASE_URL}/api/content/activities?limit=${limit}`);
    // if (!response.ok) throw new Error('Error fetching content activities');
    // return await response.json();

    // Mientras tanto, usar datos mock
    return Promise.resolve(contentActivities.slice(0, limit));
  } catch (error) {
    console.error('Error fetching content activities:', error);
    // Fallback a datos mock en caso de error
    return contentActivities.slice(0, limit);
  }
}

/**
 * Obtiene las actividades del calendario
 * @param {number} year - Año
 * @param {number} month - Mes (1-12)
 * @returns {Promise<Array>} - Actividades del calendario
 */
export async function fetchCalendarActivities(year, month) {
  try {
    // Cuando exista el endpoint:
    // const response = await fetch(`${API_BASE_URL}/api/calendar/activities?year=${year}&month=${month}`);
    // if (!response.ok) throw new Error('Error fetching calendar activities');
    // return await response.json();

    // Mientras tanto, generar datos mock según el mes y año
    const daysInMonth = new Date(year, month, 0).getDate();
    const mockCalendarData = [];

    // Generar entre 5-10 eventos aleatorios para el mes
    const numEvents = Math.floor(Math.random() * 6) + 5;

    for (let i = 0; i < numEvents; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const eventTypes = ['meeting', 'deadline', 'webinar', 'reminder', 'task'];
      const eventType =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];

      mockCalendarData.push({
        id: `cal-${year}-${month}-${day}-${i}`,
        title: `${
          eventType.charAt(0).toUpperCase() + eventType.slice(1)
        }: ${getRandomEventTitle(eventType)}`,
        date: new Date(year, month - 1, day).toISOString(),
        type: eventType,
        duration: Math.floor(Math.random() * 120) + 30, // Duración en minutos
        location: eventType === 'meeting' ? getRandomLocation() : null
      });
    }

    return Promise.resolve(mockCalendarData);
  } catch (error) {
    console.error('Error fetching calendar activities:', error);
    // Fallback a un array vacío en caso de error
    return [];
  }
}

// Funciones auxiliares para generar datos de calendario
function getRandomEventTitle(type) {
  const titles = {
    meeting: [
      'Reunión con el equipo de desarrollo',
      'Llamada con cliente potencial',
      'Revisión de progreso mensual',
      'Planificación de sprint',
      'Entrevista con candidato'
    ],
    deadline: [
      'Entrega de reporte mensual',
      'Fecha límite para nuevas inscripciones',
      'Cierre de ciclo de facturación',
      'Vencimiento de licencias',
      'Fin de periodo de prueba'
    ],
    webinar: [
      'Introducción a nuevas funcionalidades',
      'Capacitación para docentes',
      'Mejores prácticas para padres',
      'Novedades del sector educativo',
      'Presentación de casos de éxito'
    ],
    reminder: [
      'Renovar suscripciones',
      'Contactar leads pendientes',
      'Actualizar materiales educativos',
      'Revisar métricas semanales',
      'Responder correos pendientes'
    ],
    task: [
      'Preparar presentación para cliente',
      'Actualizar documentación técnica',
      'Revisar tickets pendientes',
      'Actualizar contenido del blog',
      'Preparar reporte para inversionistas'
    ]
  };

  const typeOptions = titles[type] || titles.task;
  return typeOptions[Math.floor(Math.random() * typeOptions.length)];
}

function getRandomLocation() {
  const locations = [
    'Sala de reuniones principal',
    'Oficina virtual (Zoom)',
    'Google Meet',
    'Microsoft Teams',
    'Oficina del cliente',
    'Sala de capacitación'
  ];

  return locations[Math.floor(Math.random() * locations.length)];
}
