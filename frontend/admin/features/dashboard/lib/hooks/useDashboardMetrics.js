/**
 * Hook personalizado para obtener todas las métricas necesarias para el dashboard
 * Centraliza la lógica de obtener datos de diferentes módulos
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';

// Importar hooks de diferentes módulos
import { useContents } from '../../../content/lib/hooks/useContents';
import { useLeads } from '../../../crm/lib/hooks/useLeads';
import { useTickets } from '../../../tickets/lib/hooks/useTickets';
import useUsers from '../../../users/lib/hooks/useUsers';

export function useDashboardMetrics() {
  // Estado para almacenar las métricas calculadas
  const [metrics, setMetrics] = useState({
    leads: {
      total: 0,
      newLeads: 0,
      change: '+0% esta semana',
      trend: 'neutral'
    },
    users: {
      total: 0,
      activeUsers: 0,
      change: '+0% este mes',
      trend: 'neutral'
    },
    content: {
      total: 0,
      change: '+0% este mes',
      trend: 'neutral'
    },
    tickets: {
      total: 0,
      openTickets: 0,
      change: '0% esta semana',
      trend: 'neutral'
    },
    notifications: {
      total: 0,
      newNotifications: 0,
      change: '+0 nuevas hoy',
      trend: 'neutral'
    },
    conversion: {
      rate: '0%',
      change: '+0% este mes',
      trend: 'neutral'
    }
  });

  // Usar una ref para evitar múltiples actualizaciones en un mismo ciclo
  const hasCalculatedRef = useRef(false);

  // Obtener el cliente de query para acceder al cache opcional
  const queryClient = useQueryClient();

  // Utilizar hooks de cada módulo con staleTime para evitar refetch innecesarios
  const usersQuery = useUsers();
  const leadsQuery = useLeads({ staleTime: 60000 }); // 1 minuto
  const ticketsQuery = useTickets({ staleTime: 60000 }); // 1 minuto
  const contentsQuery = useContents({ staleTime: 60000 }); // 1 minuto

  // Hook personalizado para obtener las notificaciones (simulado)
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Simulación de notificaciones - en un caso real, llamaríamos a una API
      return { total: 8, new: 2 };
    },
    staleTime: 60000 // 1 minuto
  });

  // Efecto para calcular las métricas cuando los datos están disponibles
  useEffect(() => {
    // Evitar cálculos repetidos si ya se calcularon las métricas con estos datos
    const allSuccess =
      usersQuery.isSuccess &&
      leadsQuery.isSuccess &&
      ticketsQuery.isSuccess &&
      contentsQuery.isSuccess &&
      notificationsQuery.isSuccess;

    const anyError =
      usersQuery.isError ||
      leadsQuery.isError ||
      ticketsQuery.isError ||
      contentsQuery.isError ||
      notificationsQuery.isError;

    const anyLoading =
      usersQuery.isLoading ||
      leadsQuery.isLoading ||
      ticketsQuery.isLoading ||
      contentsQuery.isLoading ||
      notificationsQuery.isLoading;

    // Solo calcular si todos los datos están disponibles y no estamos cargando
    if (allSuccess && !anyLoading && !hasCalculatedRef.current) {
      hasCalculatedRef.current = true;

      // Extraer datos
      const users = usersQuery.data?.data || [];
      const leads = leadsQuery.data || [];
      const tickets = ticketsQuery.data?.tickets || [];
      const contents = contentsQuery.data || [];
      const notifications = notificationsQuery.data || { total: 0, new: 0 };

      // Calcular métricas de leads
      const newLeadsLastWeek = leads.filter(lead => {
        if (!lead.createdAt) return false;
        const createdAt = new Date(lead.createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return createdAt >= oneWeekAgo;
      }).length;

      const leadsChangePercent =
        leads.length > 0
          ? Math.round((newLeadsLastWeek / leads.length) * 100)
          : 0;

      // Calcular métricas de usuarios
      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.isActive).length;
      const userChangePercent =
        totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

      // Calcular métricas de tickets
      const openTickets = tickets.filter(
        ticket => ticket.status === 'abierto' || ticket.status === 'pendiente'
      ).length;

      const ticketsChangePercent =
        tickets.length > 0
          ? openTickets > 0
            ? -Math.round((openTickets / tickets.length) * 100)
            : 0
          : 0;

      // Calcular tasa de conversión (leads convertidos a usuarios)
      const convertedLeads = leads.filter(
        lead => lead.status === 'converted'
      ).length;
      const conversionRate =
        leads.length > 0
          ? Math.round((convertedLeads / leads.length) * 100)
          : 0;

      // Actualizar el estado con las métricas calculadas
      setMetrics({
        leads: {
          total: leads.length,
          newLeads: newLeadsLastWeek,
          change: `+${leadsChangePercent}% esta semana`,
          trend:
            leadsChangePercent > 0
              ? 'up'
              : leadsChangePercent < 0
              ? 'down'
              : 'neutral'
        },
        users: {
          total: totalUsers,
          activeUsers: activeUsers,
          change: `+${userChangePercent}% este mes`,
          trend:
            userChangePercent > 0
              ? 'up'
              : userChangePercent < 0
              ? 'down'
              : 'neutral'
        },
        content: {
          total: contents.length,
          change: '+5% este mes', // Simulado, podría calcularse con datos reales si disponibles
          trend: 'up'
        },
        tickets: {
          total: tickets.length,
          openTickets: openTickets,
          change: `${ticketsChangePercent}% esta semana`,
          trend:
            ticketsChangePercent < 0
              ? 'down'
              : ticketsChangePercent > 0
              ? 'up'
              : 'neutral'
        },
        notifications: {
          total: notifications.total,
          newNotifications: notifications.new,
          change: `+${notifications.new} nuevas hoy`,
          trend: notifications.new > 0 ? 'up' : 'neutral'
        },
        conversion: {
          rate: `${conversionRate}%`,
          change: '+2.3% este mes', // Simulado, podría calcularse si hay datos históricos
          trend: 'up'
        }
      });
    }

    // Resetear el flag si hay cambios en los datos para permitir nuevo cálculo
    if (anyLoading) {
      hasCalculatedRef.current = false;
    }
  }, [
    usersQuery.isSuccess,
    leadsQuery.isSuccess,
    ticketsQuery.isSuccess,
    contentsQuery.isSuccess,
    notificationsQuery.isSuccess,
    usersQuery.isLoading,
    leadsQuery.isLoading,
    ticketsQuery.isLoading,
    contentsQuery.isLoading,
    notificationsQuery.isLoading
  ]);

  // Devolver el estado de carga y los datos
  return {
    isLoading:
      usersQuery.isLoading ||
      leadsQuery.isLoading ||
      ticketsQuery.isLoading ||
      contentsQuery.isLoading ||
      notificationsQuery.isLoading,
    isError:
      usersQuery.isError ||
      leadsQuery.isError ||
      ticketsQuery.isError ||
      contentsQuery.isError ||
      notificationsQuery.isError,
    metrics
  };
}
