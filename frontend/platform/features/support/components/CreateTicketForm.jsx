import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

const CreateTicketForm = ({ onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El asunto es requerido';
    if (!formData.description.trim())
      newErrors.description = 'La descripción es requerida';
    if (!formData.category) newErrors.category = 'La categoría es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Borrar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    try {
      const result = await onSubmit(formData);

      if (result && result.success) {
        // Reset form
        setFormData({
          title: '',
          category: '',
          description: ''
        });

        // Note: The modal will be closed by the parent component
      } else if (result && result.error) {
        // Mostrar el error específico que viene del backend
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Error al crear el ticket' });
    }
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

      {errors.submit && (
        <Alert className='bg-red-50 border-red-200 mb-4'>
          <div className='flex items-center gap-2 text-red-700'>
            <AlertCircle size={16} />
            <p>{errors.submit}</p>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <Label htmlFor='title' className={errors.title ? 'text-red-500' : ''}>
            Asunto
            {errors.title && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          <Input
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder='Ej: Problema con la instalación del software'
            className={`mt-1 w-full ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <p className='text-red-500 text-xs mt-1'>{errors.title}</p>
          )}
        </div>

        <div className='mb-4'>
          <Label
            htmlFor='category'
            className={errors.category ? 'text-red-500' : ''}
          >
            Categoría
            {errors.category && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          <select
            id='category'
            name='category'
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 w-full rounded-md border ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm`}
          >
            <option value=''>Seleccionar</option>
            <option value='bug'>Error de software (Bug)</option>
            <option value='feature_request'>Solicitud de funcionalidad</option>
            <option value='billing'>Facturación</option>
            <option value='technical'>Soporte técnico</option>
          </select>
          {errors.category && (
            <p className='text-red-500 text-xs mt-1'>{errors.category}</p>
          )}
        </div>

        <div className='mb-6'>
          <Label
            htmlFor='description'
            className={errors.description ? 'text-red-500' : ''}
          >
            Descripción
            {errors.description && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Describe tu problema o consulta con el mayor detalle posible...'
            className={`mt-1 w-full min-h-[120px] rounded-md border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm`}
          />
          {errors.description && (
            <p className='text-red-500 text-xs mt-1'>{errors.description}</p>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='default'
            className='bg-purple-600 hover:bg-purple-700'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketForm;
