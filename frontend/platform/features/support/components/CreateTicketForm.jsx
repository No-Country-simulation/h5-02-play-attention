import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import React from 'react';

const CreateTicketForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    subject: '',
    category: '',
    description: ''
  });

  const [success, setSuccess] = React.useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Handle validation
    if (!formData.subject || !formData.description) {
      return;
    }

    onSubmit(formData);
    setSuccess(true);

    // Reset after success message display
    setTimeout(() => {
      setSuccess(false);
      if (onClose) onClose();
    }, 3000);
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>
          Crear Nuevo Ticket de Soporte
        </h2>
        <p className='text-gray-500 text-sm'>
          Completa el formulario para enviar tu consulta o problema al equipo de
          soporte técnico.
        </p>
      </div>

      {success && (
        <Alert className='bg-green-50 border-green-200 mb-4'>
          <div className='flex items-center gap-2 text-green-700'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
              <polyline points='22 4 12 14.01 9 11.01'></polyline>
            </svg>
            <div>
              <p className='font-semibold text-green-700'>
                ¡Ticket creado con éxito!
              </p>
              <p className='text-sm'>
                Tu ticket ha sido enviado al equipo de soporte. Te responderemos
                lo antes posible.
              </p>
            </div>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <Label htmlFor='subject'>Asunto</Label>
          <Input
            id='subject'
            name='subject'
            value={formData.subject}
            onChange={handleChange}
            placeholder='Ej: Problema con la instalación del software'
            className='mt-1 w-full'
          />
        </div>

        <div className='mb-4'>
          <Label htmlFor='category'>Categoría</Label>
          <select
            id='category'
            name='category'
            value={formData.category}
            onChange={handleChange}
            className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
          >
            <option value=''>Seleccionar</option>
            <option value='bug'>Error de software</option>
            <option value='account'>Problemas de cuenta</option>
            <option value='billing'>Facturación</option>
            <option value='other'>Otro</option>
          </select>
        </div>

        <div className='mb-6'>
          <Label htmlFor='description'>Descripción</Label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Describe tu problema o consulta con el mayor detalle posible...'
            className='mt-1 w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm'
          />
        </div>

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='default'
            className='bg-purple-600 hover:bg-purple-700'
          >
            Enviar Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketForm;
