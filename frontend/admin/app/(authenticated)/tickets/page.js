import TicketManager from '@/features/tickets/TicketManager';

/**
 * Página de Gestión de Tickets de Soporte
 * Siguiendo el principio de Responsabilidad Única (SRP), esta página solo se encarga
 * de renderizar el componente principal de gestión de tickets
 */
export default function TicketsPage() {
  return <TicketManager />;
}
 