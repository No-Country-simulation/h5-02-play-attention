import { UserPlus, FileText, TicketCheck, Bell } from 'lucide-react';

/**
 * Datos de ejemplo para acciones rápidas del dashboard
 * Centralizados para facilitar mantenimiento y seguir principio SRP
 */
export const quickActions = [
  {
    title: 'Gestionar leads',
    description: 'Ver y dar seguimiento a potenciales clientes',
    icon: UserPlus,
    color: 'green',
    link: '/leads'
  },
  {
    title: 'Crear contenido nuevo',
    description: 'Añadir artículo, video o material educativo',
    icon: FileText,
    color: 'green',
    link: '/content?new=true'
  },
  {
    title: 'Responder tickets',
    description: 'Ver y responder tickets de soporte',
    icon: TicketCheck,
    color: 'amber',
    link: '/tickets'
  },
  {
    title: 'Programar notificación',
    description: 'Enviar aviso o evento a los usuarios',
    icon: Bell,
    color: 'indigo',
    link: '/notifications?new=true'
  }
];
