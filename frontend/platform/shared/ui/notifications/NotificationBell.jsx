'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/shared/providers/NotificationProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

/**
 * Componente de campana de notificaciones para el header
 * @returns {JSX.Element} Componente de React
 */
export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Formato relativo de fecha (ej: "hace 5 minutos", "hoy a las 14:30")
  const formatRelativeTime = date => {
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, 'HH:mm', { locale: es });
    } else if (diffInHours < 48) {
      return 'Ayer ' + format(date, 'HH:mm', { locale: es });
    } else {
      return format(date, 'dd MMM HH:mm', { locale: es });
    }
  };

  // Manejar el clic en una notificación
  const handleNotificationClick = notification => {
    markAsRead(notification.id);
    setIsOpen(false);

    // Manejar la navegación en base al tipo de notificación
    if (notification.type === 'message' && notification.ticketId) {
      // Navegar directamente a la vista de chat del ticket individual
      router.push(`/support?view=chat&ticketId=${notification.ticketId}`);
    } else if (notification.url) {
      // Si la notificación tiene una URL directa, navegar a ella
      router.push(notification.url);
    } else if (
      notification.onClick &&
      typeof notification.onClick === 'function'
    ) {
      // Si hay una función onClick y todavía es válida (no se ha perdido en sessionStorage)
      notification.onClick();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className='sr-only'>Notificaciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='end'>
        <div className='border-b'>
          {/* Encabezado de notificaciones */}
          <div className='p-3'>
            <h3 className='font-medium'>Notificaciones</h3>
          </div>

          {/* Botones de acción */}
          {notifications.length > 0 && (
            <div className='flex border-t px-3 py-2 bg-gray-50 justify-between'>
              <Button
                variant='ghost'
                size='sm'
                onClick={markAllAsRead}
                className='text-xs py-1 h-7'
              >
                Marcar todas como leídas
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={clearAll}
                className='text-xs py-1 h-7'
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className='max-h-80'>
          {notifications.length === 0 ? (
            <div className='p-4 text-center text-gray-500'>
              No tienes notificaciones
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='flex justify-between items-start'>
                    <div className='font-medium text-sm'>
                      {notification.title}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {formatRelativeTime(notification.timestamp)}
                    </div>
                  </div>
                  <p className='text-sm text-gray-600 mt-1'>
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
