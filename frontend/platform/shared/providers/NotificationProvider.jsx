'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Definir el contexto
const NotificationContext = createContext();

// Clave para almacenar las notificaciones en sessionStorage
const STORAGE_KEY = 'play_attention_notifications';

/**
 * Provider para gestionar notificaciones en la aplicación
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} Componente de React
 */
export function NotificationProvider({ children }) {
  // Estado de notificaciones
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones desde sessionStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedNotifications = sessionStorage.getItem(STORAGE_KEY);
        if (storedNotifications) {
          // Convertir fechas almacenadas como strings de vuelta a objetos Date
          const parsedNotifications = JSON.parse(storedNotifications).map(
            notification => ({
              ...notification,
              timestamp: new Date(notification.timestamp)
            })
          );
          setNotifications(parsedNotifications);
        }
      } catch (error) {
        console.error(
          'Error al cargar notificaciones desde sessionStorage:',
          error
        );
      }
    }
  }, []);

  // Actualizar sessionStorage cuando cambia el array de notificaciones
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error(
          'Error al guardar notificaciones en sessionStorage:',
          error
        );
      }
    }
  }, [notifications]);

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
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error(
          'Error al limpiar notificaciones del sessionStorage:',
          error
        );
      }
    }
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
