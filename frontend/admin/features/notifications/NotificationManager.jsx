'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Bell, Filter, Plus, RefreshCw } from 'lucide-react';
import NotificationList from './components/NotificationList';
import NotificationFilters from './components/NotificationFilters';
import CreateNotification from './components/CreateNotification';
import { useToast } from '@/shared/hooks/useToast';

/**
 * Componente principal para la gestión de notificaciones
 * Siguiendo SRP, este componente gestiona la vista general de notificaciones
 * y orquesta los componentes específicos para cada funcionalidad
 */
export default function NotificationManager() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: null
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  // Simulamos carga de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        // Aquí iría la llamada a la API
        setTimeout(() => {
          setNotifications(mockNotifications);
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
    };

    loadData();
  }, []);

  // Filtrar notificaciones según criterios seleccionados
  const filteredNotifications = notifications.filter(notification => {
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

  // Manejar cambios de filtros
  const handleFilterChange = newFilters => {
    setActiveFilters({ ...activeFilters, ...newFilters });
  };

  // Manejar la creación de una nueva notificación
  const handleCreateNotification = newNotification => {
    // Aquí iría la llamada a la API para crear la notificación
    const notification = {
      id: notifications.length + 1,
      date: new Date(),
      status: 'unread',
      ...newNotification
    };

    setNotifications([notification, ...notifications]);
    setShowCreateModal(false);

    toast({
      title: 'Notificación creada',
      description: 'La notificación se ha creado correctamente'
    });
  };

  // Manejar marcar notificación como leída
  const handleMarkAsRead = id => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, status: 'read' }
          : notification
      )
    );

    toast({
      title: 'Notificación actualizada',
      description: 'La notificación se ha marcado como leída'
    });
  };

  // Manejar eliminación de notificación
  const handleDeleteNotification = id => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );

    toast({
      title: 'Notificación eliminada',
      description: 'La notificación se ha eliminado correctamente'
    });
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div>
            <CardTitle className='text-2xl font-bold'>
              Gestión de Notificaciones
            </CardTitle>
            <CardDescription>
              Administra las notificaciones del sistema para usuarios, tickets y
              leads
            </CardDescription>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  toast({
                    title: 'Notificaciones actualizadas',
                    description: 'Se han actualizado las notificaciones'
                  });
                }, 800);
              }}
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Actualizar
            </Button>
            <Button size='sm' onClick={() => setShowCreateModal(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Nueva Notificación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='all' className='w-full'>
            <div className='flex justify-between items-center mb-4'>
              <TabsList>
                <TabsTrigger value='all'>Todas</TabsTrigger>
                <TabsTrigger value='unread'>No leídas</TabsTrigger>
                <TabsTrigger value='tickets'>Tickets</TabsTrigger>
                <TabsTrigger value='users'>Usuarios</TabsTrigger>
                <TabsTrigger value='leads'>Leads</TabsTrigger>
              </TabsList>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setActiveFilters({
                    type: 'all',
                    status: 'all',
                    dateRange: null
                  })
                }
              >
                <Filter className='mr-2 h-4 w-4' />
                Filtros
              </Button>
            </div>

            <TabsContent value='all'>
              <NotificationList
                notifications={filteredNotifications}
                isLoading={isLoading}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            </TabsContent>

            <TabsContent value='unread'>
              <NotificationList
                notifications={filteredNotifications.filter(
                  n => n.status === 'unread'
                )}
                isLoading={isLoading}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            </TabsContent>

            <TabsContent value='tickets'>
              <NotificationList
                notifications={filteredNotifications.filter(
                  n => n.type === 'ticket'
                )}
                isLoading={isLoading}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            </TabsContent>

            <TabsContent value='users'>
              <NotificationList
                notifications={filteredNotifications.filter(
                  n => n.type === 'user'
                )}
                isLoading={isLoading}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            </TabsContent>

            <TabsContent value='leads'>
              <NotificationList
                notifications={filteredNotifications.filter(
                  n => n.type === 'lead'
                )}
                isLoading={isLoading}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showCreateModal && (
        <CreateNotification
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNotification}
        />
      )}

      <NotificationFilters
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
