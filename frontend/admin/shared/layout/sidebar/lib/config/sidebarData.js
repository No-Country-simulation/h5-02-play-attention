import {
  LayoutDashboard,
  Users,
  FileText,
  TicketCheck,
  Bell,
  Building,
  Briefcase
} from 'lucide-react';

/**
 * Datos de navegación del sidebar
 * Se organizan por categorías funcionales para reflejar
 * la naturaleza de plataforma completa, no solo admin panel
 */
export const menuItems = [
  // Sección principal - Dashboard
  {
    name: 'Panel de Control',
    icon: LayoutDashboard,
    path: '/dashboard',
    category: 'principal'
  },

  // CRM como módulo destacado independiente
  {
    name: 'CRM',
    icon: Briefcase,
    path: '/crm',
    category: 'crm_destacado'
  },

  // Sección de contenidos
  {
    name: 'Gestion de Contenido',
    icon: FileText,
    path: '/content',
    category: 'contenido'
  },

  // Sección de soporte
  {
    name: 'Tickets de Soporte',
    icon: TicketCheck,
    path: '/tickets',
    category: 'soporte'
  },

  // Sección de administración
  {
    name: 'Gestión de Usuarios',
    icon: Users,
    path: '/users',
    category: 'administracion'
  },
  {
    name: 'Notificaciones',
    icon: Bell,
    path: '/notifications',
    category: 'administracion'
  }
];

/**
 * Versión de la aplicación
 */
export const appVersion = 'v1.0';
