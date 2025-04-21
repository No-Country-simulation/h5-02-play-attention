import { UserPlus, Users, FileText, TicketCheck, Bell } from 'lucide-react';

/**
 * Datos de ejemplo para las métricas del dashboard
 * Centralizados para facilitar mantenimiento y seguir principio SRP
 */
export const dashboardMetrics = [
  {
    title: 'Leads Nuevos',
    value: '32',
    change: '+8%',
    trend: 'up',
    icon: UserPlus,
    color: 'green',
    link: '/leads'
  },
  {
    title: 'Usuarios Activos',
    value: '1,254',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'blue',
    link: '/users'
  },
  {
    title: 'Contenido Total',
    value: '87',
    change: '+5%',
    trend: 'up',
    icon: FileText,
    color: 'indigo',
    link: '/content'
  },
  {
    title: 'Tickets Abiertos',
    value: '14',
    change: '-3%',
    trend: 'down',
    icon: TicketCheck,
    color: 'amber',
    link: '/tickets'
  },
  {
    title: 'Eventos Próximos',
    value: '3',
    change: '0%',
    trend: 'neutral',
    icon: Bell,
    color: 'green',
    link: '/notifications'
  }
];
