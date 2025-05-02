import NotificationManager from '@/features/notifications/NotificationManager';

/**
 * Página de Gestión de Notificaciones
 * Siguiendo el principio de Responsabilidad Única (SRP), esta página solo se encarga
 * de renderizar el componente principal de gestión de notificaciones
 */
export default function NotificationsPage() {
  return <NotificationManager />;
}
