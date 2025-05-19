'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  Trash2,
  User,
  TicketCheck,
  UserPlus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/shared/ui/alert-dialog';

/**
 * Componente para mostrar la lista de notificaciones
 * Siguiendo el principio de responsabilidad única (SRP)
 */
export default function NotificationList({
  notifications,
  isLoading,
  onMarkAsRead,
  onDelete
}) {
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Función para obtener el icono según el tipo de notificación
  const getNotificationIcon = type => {
    switch (type) {
      case 'ticket':
        return <TicketCheck className='h-5 w-5 text-blue-500' />;
      case 'user':
        return <User className='h-5 w-5 text-green-500' />;
      case 'lead':
        return <UserPlus className='h-5 w-5 text-purple-500' />;
      default:
        return <Bell className='h-5 w-5 text-gray-500' />;
    }
  };

  // Confirmar eliminación de notificación
  const confirmDelete = notification => {
    setNotificationToDelete(notification);
  };
  //comentario
  // Procesar eliminación de notificación
  const handleDelete = () => {
    if (notificationToDelete) {
      onDelete(notificationToDelete.id);
      setNotificationToDelete(null);
    }
  };

  // Mostrar mensaje cuando no hay notificaciones
  if (!isLoading && notifications.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-8 text-center'>
        <Bell className='h-12 w-12 text-gray-300 mb-2' />
        <h3 className='text-lg font-semibold text-gray-900'>
          No hay notificaciones
        </h3>
        <p className='text-sm text-gray-500 max-w-md mt-1'>
          No se encontraron notificaciones con los criterios actuales de
          filtrado.
        </p>
      </div>
    );
  }

  // Mostrar skeletons durante la carga
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className='flex items-start space-x-4 p-4 rounded-md border border-gray-100'
          >
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='space-y-2 flex-1'>
              <Skeleton className='h-5 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <div className='flex items-center mt-2'>
                <Skeleton className='h-4 w-24 mr-2' />
              </div>
            </div>
            <div>
              <Skeleton className='h-8 w-8 rounded-md' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className='space-y-3'>
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              flex items-start space-x-4 p-4 rounded-lg border 
              ${
                notification.status === 'unread'
                  ? 'bg-blue-50 border-blue-100'
                  : 'bg-white border-gray-100'
              }
              transition-all hover:shadow-sm
            `}
          >
            <div className='flex-shrink-0'>
              {getNotificationIcon(notification.type)}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex justify-between items-start'>
                <h4 className='text-sm font-medium text-gray-900 truncate'>
                  {notification.title}
                </h4>
                <div className='flex items-center text-xs text-gray-500 ml-2'>
                  <Clock className='h-3 w-3 mr-1' />
                  {formatDistanceToNow(new Date(notification.date), {
                    addSuffix: true,
                    locale: es
                  })}
                </div>
              </div>

              <p className='mt-1 text-sm text-gray-600'>
                {notification.message}
              </p>

              <div className='flex items-center mt-2'>
                <span
                  className={`
                  text-xs px-2 py-1 rounded-full
                  ${
                    notification.type === 'ticket' &&
                    'bg-blue-100 text-blue-700'
                  }
                  ${
                    notification.type === 'user' &&
                    'bg-green-100 text-green-700'
                  }
                  ${
                    notification.type === 'lead' &&
                    'bg-purple-100 text-purple-700'
                  }
                `}
                >
                  {notification.type === 'ticket' && 'Ticket'}
                  {notification.type === 'user' && 'Usuario'}
                  {notification.type === 'lead' && 'Lead'}
                </span>

                {notification.status === 'unread' && (
                  <span className='ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full'>
                    No leída
                  </span>
                )}
              </div>
            </div>

            <div className='flex space-x-1'>
              {notification.status === 'unread' && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onMarkAsRead(notification.id)}
                  title='Marcar como leída'
                >
                  <Check className='h-4 w-4 text-green-500' />
                </Button>
              )}

              <Button
                variant='ghost'
                size='icon'
                onClick={() => confirmDelete(notification)}
                title='Eliminar notificación'
              >
                <Trash2 className='h-4 w-4 text-red-500' />
              </Button>

              <Button variant='ghost' size='icon' title='Ver detalles'>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!notificationToDelete}
        onOpenChange={() => setNotificationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar notificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esta notificación se eliminará
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
