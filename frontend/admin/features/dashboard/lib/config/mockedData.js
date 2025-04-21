/**
 * Datos mock para el dashboard
 * Se utilizarán como fallback mientras no exista backend
 */

// Métricas del dashboard
export const dashboardMetrics = [
  {
    id: 'total-students',
    title: 'Estudiantes totales',
    value: 1256,
    change: 12.5,
    changeType: 'increase',
    icon: 'users'
  },
  {
    id: 'active-subscriptions',
    title: 'Suscripciones activas',
    value: 843,
    change: 8.2,
    changeType: 'increase',
    icon: 'subscription'
  },
  {
    id: 'month-revenue',
    title: 'Ingresos del mes',
    value: 12500,
    change: 3.8,
    changeType: 'increase',
    icon: 'dollar',
    prefix: '$'
  },
  {
    id: 'support-tickets',
    title: 'Tickets de soporte',
    value: 18,
    change: 2.1,
    changeType: 'decrease',
    icon: 'ticket'
  }
];

// Alertas del dashboard
export const overviewAlerts = [
  {
    id: 'a1',
    type: 'warning',
    message: '3 estudiantes con suscripción próxima a vencer',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/students/expiring'
  },
  {
    id: 'a2',
    type: 'success',
    message: '5 nuevas suscripciones en las últimas 24 horas',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/subscriptions/new'
  },
  {
    id: 'a3',
    type: 'error',
    message: 'Error en la última integración de pagos',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/settings/integrations'
  }
];

// Acciones rápidas
export const quickActions = [
  {
    id: 'qa1',
    title: 'Nuevo estudiante',
    description: 'Registrar un nuevo estudiante en el sistema',
    icon: 'userPlus',
    color: 'blue',
    url: '/students/new'
  },
  {
    id: 'qa2',
    title: 'Nueva suscripción',
    description: 'Crear una nueva suscripción para un estudiante',
    icon: 'creditCard',
    color: 'green',
    url: '/subscriptions/new'
  },
  {
    id: 'qa3',
    title: 'Nuevo ticket',
    description: 'Crear un nuevo ticket de soporte',
    icon: 'ticket',
    color: 'amber',
    url: '/support/new-ticket'
  },
  {
    id: 'qa4',
    title: 'Nuevo contenido',
    description: 'Agregar nuevo contenido educativo',
    icon: 'folderPlus',
    color: 'purple',
    url: '/content/new'
  }
];

// Leads recientes
export const recentLeads = [
  {
    id: 'lead1',
    name: 'Carolina Méndez',
    email: 'carolina.mendez@example.com',
    phone: '+54 911 5678-4321',
    status: 'new',
    source: 'website',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'lead2',
    name: 'Martín Gutiérrez',
    email: 'martin.gutierrez@example.com',
    phone: '+54 911 2345-6789',
    status: 'contacted',
    source: 'referral',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'lead3',
    name: 'Luciana Torres',
    email: 'luciana.torres@example.com',
    phone: '+54 911 8765-4321',
    status: 'qualified',
    source: 'social',
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'lead4',
    name: 'Federico Paz',
    email: 'federico.paz@example.com',
    phone: '+54 911 3456-7890',
    status: 'new',
    source: 'advertisement',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'lead5',
    name: 'Valentina Quiroga',
    email: 'valentina.quiroga@example.com',
    phone: '+54 911 7890-1234',
    status: 'contacted',
    source: 'website',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Tickets recientes
export const recentTickets = [
  {
    id: 'ticket1',
    title: 'Problema con acceso a curso',
    description: 'No puedo acceder al módulo 3 del curso de matemáticas',
    status: 'open',
    priority: 'high',
    createdBy: 'Juan Pérez',
    assignedTo: 'Soporte Técnico',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ticket2',
    title: 'Error en el pago de suscripción',
    description:
      'El sistema muestra un error al intentar renovar mi suscripción',
    status: 'in-progress',
    priority: 'critical',
    createdBy: 'María González',
    assignedTo: 'Soporte de Pagos',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ticket3',
    title: 'Solicitud de reembolso',
    description:
      'Solicito reembolso por curso no compatible con mi dispositivo',
    status: 'open',
    priority: 'medium',
    createdBy: 'Roberto López',
    assignedTo: 'Atención al Cliente',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ticket4',
    title: 'Problema con certificado',
    description: 'No puedo descargar mi certificado de finalización',
    status: 'open',
    priority: 'low',
    createdBy: 'Laura Sánchez',
    assignedTo: 'Soporte Técnico',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ticket5',
    title: 'Consulta sobre suscripción familiar',
    description: '¿Es posible compartir la cuenta con mis hijos?',
    status: 'closed',
    priority: 'low',
    createdBy: 'Carlos Rodríguez',
    assignedTo: 'Ventas',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

// Actividades de contenido
export const contentActivities = [
  {
    id: 'activity1',
    title: 'Nuevo curso: Matemáticas Avanzadas',
    type: 'new-course',
    description: 'Se ha publicado un nuevo curso de matemáticas avanzadas',
    author: 'Prof. Martínez',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity2',
    title: 'Actualización: Física Básica',
    type: 'update',
    description: 'Se actualizó el módulo 2 del curso de física básica',
    author: 'Prof. García',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity3',
    title: 'Nueva evaluación: Química Orgánica',
    type: 'evaluation',
    description: 'Se ha agregado una nueva evaluación al curso de química',
    author: 'Prof. López',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity4',
    title: 'Nuevo recurso: Guía de Estudio Historia',
    type: 'resource',
    description: 'Nueva guía de estudio para el curso de historia universal',
    author: 'Prof. Fernández',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];
