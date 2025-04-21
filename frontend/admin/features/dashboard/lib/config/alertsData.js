import {
  UserPlus,
  FileText,
  TicketCheck,
  Clock,
  Users,
  Bell,
  AlertCircle
} from 'lucide-react';

/**
 * Datos de ejemplo para las alertas del dashboard
 * Centralizados para facilitar mantenimiento y seguir principio SRP
 */
export const dashboardAlerts = [
  {
    id: 1,
    title: 'Leads sin seguimiento',
    description: '8 leads nuevos no han sido contactados en 48 horas',
    type: 'lead',
    icon: UserPlus,
    color: 'danger',
    actionText: 'Atender ahora',
    actionUrl: '/leads'
  },
  {
    id: 2,
    title: 'Tickets sin responder',
    description: '5 tickets llevan más de 24 horas sin respuesta',
    type: 'ticket',
    icon: TicketCheck,
    color: 'warning',
    actionText: 'Atender ahora',
    actionUrl: '/tickets'
  },
  {
    id: 3,
    title: 'Contenido pendiente de revisión',
    description: '3 artículos están en borrador y necesitan ser publicados',
    type: 'content',
    icon: FileText,
    color: 'primary',
    actionText: 'Atender ahora',
    actionUrl: '/content'
  },
  {
    id: 4,
    title: 'Webinar próximo',
    description: 'El webinar "Técnicas de concentración" comienza en 2 días',
    type: 'event',
    icon: Clock,
    color: 'info',
    actionText: 'Ver detalles',
    actionUrl: '/events'
  },
  {
    id: 5,
    title: 'Usuarios inactivos',
    description: '12 usuarios no han iniciado sesión en el último mes',
    type: 'user',
    icon: Users,
    color: 'info',
    actionText: 'Revisar usuarios',
    actionUrl: '/users'
  },
  {
    id: 6,
    title: 'Actualización de plataforma',
    description: 'Nueva versión disponible para implementar',
    type: 'system',
    icon: Bell,
    color: 'primary',
    actionText: 'Ver detalles',
    actionUrl: '/settings'
  },
  {
    id: 7,
    title: 'Pagos pendientes',
    description: '3 facturas requieren verificación',
    type: 'finance',
    icon: Bell,
    color: 'warning',
    actionText: 'Revisar pagos',
    actionUrl: '/finances'
  },
  {
    id: 8,
    title: 'Comentarios nuevos',
    description: '6 comentarios recientes requieren moderación',
    type: 'content',
    icon: FileText,
    color: 'primary',
    actionText: 'Moderar',
    actionUrl: '/comments'
  }
];

/**
 * Datos de ejemplo para alertas mostradas en la vista de resumen
 */
export const overviewAlerts = [
  {
    title: 'Leads sin seguimiento',
    description: '8 leads nuevos no han sido contactados en 48 horas',
    icon: UserPlus,
    color: 'red',
    action: '/leads?filter=sin_seguimiento'
  },
  {
    title: 'Tickets sin responder',
    description: '5 tickets llevan más de 24 horas sin respuesta',
    icon: AlertCircle,
    color: 'red',
    action: '/tickets?filter=sin_responder'
  },
  {
    title: 'Contenido pendiente de revisión',
    description: '3 artículos están en borrador y necesitan ser publicados',
    icon: FileText,
    color: 'amber',
    action: '/content?status=borrador'
  },
  {
    title: 'Webinar próximo',
    description: 'El webinar "Técnicas de concentración" comienza en 2 días',
    icon: Clock,
    color: 'blue',
    action: '/notifications/edit/123'
  }
];
