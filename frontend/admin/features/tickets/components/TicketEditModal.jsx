'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { useAssignableUsers } from '../lib/hooks';

// Opciones para los campos de selección
const statusOptions = [
  { id: 'abierto', label: 'Abierto' },
  { id: 'en proceso', label: 'En proceso' },
  { id: 'resuelto', label: 'Resuelto' },
  { id: 'cerrado', label: 'Cerrado' }
];

const priorityOptions = [
  { id: 'alta', label: 'Alta' },
  { id: 'media', label: 'Media' },
  { id: 'baja', label: 'Baja' }
];

const categoryOptions = [
  { id: 'bug', label: 'Bug' },
  { id: 'feature', label: 'Función nueva' },
  { id: 'support', label: 'Soporte' },
  { id: 'question', label: 'Pregunta' },
  { id: 'other', label: 'Otro' }
];

const originOptions = [
  { id: 'web', label: 'Web' },
  { id: 'app', label: 'Aplicación móvil' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Teléfono' },
  { id: 'crm', label: 'CRM' },
  { id: 'admin_panel', label: 'Panel de Administración' }
];

/**
 * Modal para editar los atributos de un ticket
 */
export default function TicketEditModal({
  open,
  onOpenChange,
  ticket,
  onSubmit,
  isSubmitting
}) {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    assignedUserId: '',
    category: '',
    ticketOrigin: ''
  });

  // Cargar usuarios asignables
  const {
    data: assignableUsersData = [],
    isLoading: isLoadingUsers,
    error: usersError
  } = useAssignableUsers();

  // Procesar la lista de usuarios para mostrar correctamente
  const assignableUsers = useMemo(() => {
    if (!assignableUsersData || !Array.isArray(assignableUsersData)) {
      return [];
    }

    // Normalizar datos de usuarios para mostrar correctamente
    return assignableUsersData.map(user => ({
      id: user._id || user.id || '',
      name: user.fullname || user.name || 'Sin nombre',
      email: user.email || ''
    }));
  }, [assignableUsersData]);

  // Inicializar el formulario con los datos del ticket cuando se abre el modal
  useEffect(() => {
    if (ticket && open) {
      // Encontrar usuario asignado si existe
      const assignedUser = assignableUsers.find(
        user =>
          ticket.assignedTo === user.name || ticket.assignedTo === user.email
      );

      setFormData({
        status: ticket.status || 'abierto',
        priority: ticket.priority || 'media',
        assignedTo: ticket.assignedTo || 'Sin asignar',
        assignedUserId: assignedUser?.id || '',
        category: ticket.category || 'bug',
        ticketOrigin: ticket.ticketOrigin || 'web'
      });
    }
  }, [ticket, open, assignableUsers]);

  // Función para manejar cambios en los selects
  const handleSelectChange = (name, value) => {
    // Si cambia la asignación de usuario
    if (name === 'assignedUserId') {
      if (value === 'none') {
        setFormData(prev => ({
          ...prev,
          assignedUserId: '',
          assignedTo: 'Sin asignar'
        }));
      } else {
        // Buscar el usuario seleccionado para obtener su nombre
        const selectedUser = assignableUsers.find(user => user.id === value);
        setFormData(prev => ({
          ...prev,
          assignedUserId: value,
          assignedTo: selectedUser ? selectedUser.name : 'Sin asignar'
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = e => {
    e.preventDefault();

    // Preparar datos para actualización
    const updateData = {
      id: ticket.id,
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      category: formData.category,
      ticketOrigin: formData.ticketOrigin
    };


    // Llamar a la función de actualización proporcionada por el componente padre
    onSubmit(updateData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Editar ticket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          {/* Campo Estado */}
          <div className='space-y-2'>
            <Label htmlFor='status'>Estado</Label>
            <Select
              value={formData.status}
              onValueChange={value => handleSelectChange('status', value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecciona el estado' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Prioridad */}
          <div className='space-y-2'>
            <Label htmlFor='priority'>Prioridad</Label>
            <Select
              value={formData.priority}
              onValueChange={value => handleSelectChange('priority', value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecciona la prioridad' />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Asignado a */}
          <div className='space-y-2'>
            <Label htmlFor='assignedUserId'>Asignado a</Label>
            <Select
              value={formData.assignedUserId || 'none'}
              onValueChange={value =>
                handleSelectChange('assignedUserId', value)
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecciona un usuario'>
                  {formData.assignedUserId === ''
                    ? 'Sin asignar'
                    : formData.assignedTo}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>Sin asignar</SelectItem>
                {isLoadingUsers ? (
                  <div className='flex justify-center p-2'>
                    <LoadingSpinner size={16} />
                  </div>
                ) : (
                  assignableUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Categoría */}
          <div className='space-y-2'>
            <Label htmlFor='category'>Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={value => handleSelectChange('category', value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecciona una categoría' />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Origen */}
          <div className='space-y-2'>
            <Label htmlFor='ticketOrigin'>Origen</Label>
            <Select
              value={formData.ticketOrigin}
              onValueChange={value => handleSelectChange('ticketOrigin', value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecciona el origen' />
              </SelectTrigger>
              <SelectContent>
                {originOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='min-w-[140px]'
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center'>
             {/*      <LoadingSpinner size={16} className='mr-2' /> */}
                  <span>Guardando</span>
                </div>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
