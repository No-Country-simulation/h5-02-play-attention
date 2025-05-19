'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { sortNotificationsByDate } from '../lib/utils';

/**
 * Hook personalizado para la gestión de notificaciones
 * Encapsula la lógica de negocio relacionada con notificaciones siguiendo el principio OCP
 */
export function useNotifications(initialFilters = {}) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: null,
    ...initialFilters
  });
  const { toast } = useToast();

  // Demo data para notificaciones (en producción vendría de una API)
  const mockNotifications = [
    {
      id: 1,
      title: 'Nuevo ticket creado',
      message: 'Se ha creado un nuevo ticket #1234 que requiere atención',
      type: 'ticket',
      status: 'unread',
      date: new Date(2023, 9, 15, 10, 30),
      relatedId: '1234'
    },
    {
      id: 2,
      title: 'Nuevo usuario registrado',
      message: 'El usuario Carlos Martínez se ha registrado en la plataforma',
      type: 'user',
      status: 'read',
      date: new Date(2023, 9, 14, 9, 45),
      relatedId: '5678'
    },
    {
      id: 3,
      title: 'Nuevo lead generado',
      message: 'Se ha generado un nuevo lead desde la campaña de marketing Q4',
      type: 'lead',
      status: 'unread',
      date: new Date(2023, 9, 14, 8, 15),
      relatedId: '9012'
    },
    {
      id: 4,
      title: 'Ticket #5678 actualizado',
      message: 'El cliente ha respondido al ticket #5678',
      type: 'ticket',
      status: 'unread',
      date: new Date(2023, 9, 13, 15, 20),
      relatedId: '5678'
    },
    {
      id: 5,
      title: 'Recordatorio de seguimiento',
      message: 'Recordatorio para dar seguimiento al lead Empresa XYZ',
      type: 'lead',
      status: 'read',
      date: new Date(2023, 9, 12, 11, 0),
      relatedId: '3456'
    }
  ];

  /**
   * Cargar notificaciones (simulado)
   */
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Aquí iría la llamada a la API
      setTimeout(() => {
        setNotifications(sortNotificationsByDate(mockNotifications));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las notificaciones',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  }, []);

  /**
   * Efecto para cargar notificaciones al iniciar
   */
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /**
   * Filtra notificaciones según criterios
   */
  const getFilteredNotifications = useCallback(() => {
    return notifications.filter(notification => {
      // Filtro por tipo
      if (
        activeFilters.type !== 'all' &&
        notification.type !== activeFilters.type
      ) {
        return false;
      }

      // Filtro por estado
      if (
        activeFilters.status !== 'all' &&
        notification.status !== activeFilters.status
      ) {
        return false;
      }

      // Filtro por fecha (si hay rango seleccionado)
      if (activeFilters.dateRange) {
        const notificationDate = new Date(notification.date);
        if (
          notificationDate < activeFilters.dateRange.from ||
          notificationDate > activeFilters.dateRange.to
        ) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, activeFilters]);

  /**
   * Actualiza los filtros activos
   */
  const updateFilters = useCallback(newFilters => {
    setActiveFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Reinicia todos los filtros a sus valores por defecto
   */
  const resetFilters = useCallback(() => {
    setActiveFilters({
      type: 'all',
      status: 'all',
      dateRange: null
    });
  }, []);

  /**
   * Añade una nueva notificación
   */
  const addNotification = useCallback(
    newNotification => {
      const notification = {
        id: notifications.length + 1,
        date: new Date(),
        status: 'unread',
        ...newNotification
      };

      setNotifications(prev => [notification, ...prev]);

      toast({
        title: 'Notificación creada',
        description: 'La notificación se ha creado correctamente'
      });

      return notification;
    },
    [notifications, toast]
  );

  /**
   * Marca una notificación como leída
   */
  const markAsRead = useCallback(
    id => {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, status: 'read' }
            : notification
        )
      );

      toast({
        title: 'Notificación actualizada',
        description: 'La notificación se ha marcado como leída'
      });
    },
    [toast]
  );

  /**
   * Elimina una notificación
   */
  const deleteNotification = useCallback(
    id => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );

      toast({
        title: 'Notificación eliminada',
        description: 'La notificación se ha eliminado correctamente'
      });
    },
    [toast]
  );

  /**
   * Marca todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, status: 'read' }))
    );

    toast({
      title: 'Notificaciones actualizadas',
      description: 'Todas las notificaciones se han marcado como leídas'
    });
  }, [toast]);

  return {
    notifications,
    filteredNotifications: getFilteredNotifications(),
    isLoading,
    activeFilters,
    updateFilters,
    resetFilters,
    addNotification,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    refreshNotifications: loadNotifications
  };
}
