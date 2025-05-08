'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Definir el contexto
const NotificationContext = createContext();

/**
 * Provider para gestionar notificaciones en la aplicación
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} Componente de React
 */
export function NotificationProvider({ children }) {
  // Estado de notificaciones
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Actualizar contador de no leídas cuando cambia el array de notificaciones
  useEffect(() => {
    const count = notifications.filter(
      notification => !notification.read
    ).length;
    setUnreadCount(count);
  }, [notifications]);

  // Agregar una nueva notificación
  const addNotification = notification => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Si hay una función de sonido configurada, reproducirla
    if (typeof window !== 'undefined' && window.playNotificationSound) {
      window.playNotificationSound();
    }

    return newNotification.id;
  };

  // Marcar una notificación como leída
  const markAsRead = notificationId => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Eliminar una notificación
  const removeNotification = notificationId => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Limpiar todas las notificaciones
  const clearAll = () => {
    setNotifications([]);
  };

  // Valor del contexto
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook para usar el contexto de notificaciones
 * @returns {Object} Funciones y estado de notificaciones
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications debe ser usado dentro de un NotificationProvider'
    );
  }
  return context;
};
