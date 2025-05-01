'use client';

import { useState, useEffect } from 'react';
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
  { id: 'crm', label: 'CRM' }
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
    assignedTo: 'none',
    category: '',
    ticketOrigin: ''
  });

  // Cargar usuarios asignables
  const {
    data: assignableUsers = [],
    isLoading: isLoadingUsers,
    error: usersError
  } = useAssignableUsers();

  // Inicializar el formulario con los datos del ticket cuando se abre el modal
  useEffect(() => {
    if (ticket && open) {
      setFormData({
        status: ticket.status || 'abierto',
        priority: ticket.priority || 'media',
        assignedTo: ticket.assignedTo || 'none',
        category: ticket.category || 'other',
        ticketOrigin: ticket.ticketOrigin || 'web'
      });
    }
  }, [ticket, open]);

  // Función para manejar cambios en los selects
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = e => {
    e.preventDefault();

    // Preparar datos para actualización
    const updateData = {
      id: ticket.id,
      ...formData,
      // Convertir 'none' a cadena vacía para el backend
      assignedTo: formData.assignedTo === 'none' ? '' : formData.assignedTo
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
              <SelectTrigger>
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
              <SelectTrigger>
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
            <Label htmlFor='assignedTo'>Asignado a</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={value => handleSelectChange('assignedTo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un usuario' />
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
                      {user.name || user.email}
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
              <SelectTrigger>
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
              <SelectTrigger>
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
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner size={16} className='mr-2' />
              ) : null}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
