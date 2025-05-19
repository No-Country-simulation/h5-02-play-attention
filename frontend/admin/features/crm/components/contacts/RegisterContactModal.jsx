'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import {
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Users,
  MessageCircle,
  FileText,
  Loader2
} from 'lucide-react';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';
import { useCreateEngagement } from '../../lib/hooks/useEngagements';
import { FaWhatsapp } from 'react-icons/fa';

const contactTypes = [
  { value: 'email', label: 'Email', icon: <Mail className='h-4 w-4 mr-2' /> },
  {
    value: 'call',
    label: 'WhatsApp',
    icon: <FaWhatsapp className='h-4 w-4 mr-2' />
  },
  {
    value: 'meeting',
    label: 'Reunión',
    icon: <Users className='h-4 w-4 mr-2' />
  },
  {
    value: 'message',
    label: 'Mensaje',
    icon: <MessageCircle className='h-4 w-4 mr-2' />
  }
];

/**
 * Modal para registrar un nuevo contacto con un lead
 */
export default function RegisterContactModal({
  isOpen,
  onClose,
  leadName,
  leadId
}) {
  const [formData, setFormData] = useState({
    type: 'call',
    date: new Date(),
    subject: '',
    content: '',
    outcome: ''
  });

  // Usar React Query para crear un nuevo engagement
  const createEngagementMutation = useCreateEngagement();

  // Formatear fecha para mostrar en el selector
  const formatDate = date => {
    return format(date, 'PPP', { locale: es });
  };

  // Actualizar campo del formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      // Validación básica: el asunto es requerido
      return;
    }

    // Crear objeto de contacto con el formato esperado
    const newContact = {
      leadId,
      type: formData.type,
      date: formData.date.toISOString(),
      user: 'Usuario Actual', // En un sistema real, esto vendría del contexto de autenticación
      subject: formData.subject,
      content: formData.content,
      outcome: formData.outcome
    };

    try {
      // Usar el mutation para guardar en la API
      await createEngagementMutation.mutateAsync(newContact);

      // Cerrar modal
      onClose();

      // Resetear formulario
      setFormData({
        type: 'call',
        date: new Date(),
        subject: '',
        content: '',
        outcome: ''
      });
    } catch (error) {
      console.error('Error al guardar el contacto:', error);
    }
  };

  // Renderizar icono de tipo de contacto
  const renderTypeIcon = type => {
    const typeInfo = contactTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.icon : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Registrar contacto</DialogTitle>
          <DialogDescription>
            Agrega una nueva interacción con {leadName || 'el lead'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          {/* Tipo de contacto */}
          <div className='space-y-2'>
            <Label htmlFor='type'>Tipo de contacto</Label>
            <Select
              value={formData.type}
              onValueChange={value => handleChange('type', value)}
            >
              <SelectTrigger id='type'>
                <div className='flex items-center'>
                  {renderTypeIcon(formData.type)}
                  <SelectValue placeholder='Seleccionar tipo' />
                </div>
              </SelectTrigger>
              <SelectContent>
                {contactTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className='flex items-center'>{type.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha y hora */}
          <div className='space-y-2'>
            <Label htmlFor='date'>Fecha y hora</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !formData.date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {formData.date
                    ? formatDate(formData.date)
                    : 'Seleccionar fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={formData.date}
                  onSelect={date => handleChange('date', date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Asunto */}
          <div className='space-y-2'>
            <Label htmlFor='subject'>Asunto</Label>
            <Input
              id='subject'
              value={formData.subject}
              onChange={e => handleChange('subject', e.target.value)}
              placeholder='Ej. Llamada de seguimiento'
              required
            />
          </div>

          {/* Contenido */}
          <div className='space-y-2'>
            <Label htmlFor='content'>Detalle</Label>
            <Textarea
              id='content'
              value={formData.content}
              onChange={e => handleChange('content', e.target.value)}
              placeholder='Describe la interacción con el lead'
              rows={4}
            />
          </div>

          {/* Resultado */}
          <div className='space-y-2'>
            <Label htmlFor='outcome'>Resultado</Label>
            <Input
              id='outcome'
              value={formData.outcome}
              onChange={e => handleChange('outcome', e.target.value)}
              placeholder='Ej. Interesado - Solicita más información'
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={createEngagementMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            onClick={handleSubmit}
            disabled={createEngagementMutation.isPending}
          >
            {createEngagementMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Guardando...
              </>
            ) : (
              'Guardar contacto'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
