'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import {
  useCreateCategory,
  useUpdateCategory
} from '../../lib/hooks/useCategories';

/**
 * Formulario para crear o editar categorías
 * @param {Object} initialData - Datos iniciales para edición
 * @param {Function} onCancel - Función para cancelar
 * @param {Boolean} isEditing - Indica si estamos editando o creando
 */
export default function CategoryForm({
  initialData,
  onCancel,
  isEditing = false
}) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});

  // Estado para controlar el envío
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks de mutación
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(initialData?.id);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || ''
      });
    }
  }, [isEditing, initialData]);

  // Manejar cambios en los campos del formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error al editar el campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la categoría es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar el formulario
  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }

      // Regresar a la lista de categorías
      onCancel();
    } catch (error) {
      console.error('Error al guardar categoría:', error);

      // Mostrar errores del servidor si los hay
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onCancel}
          disabled={isSubmitting}
          className='h-8 w-8'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <CardTitle>
          {isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Nombre <span className='text-red-500'>*</span>
            </label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Nombre de la categoría'
              className={`w-full ${errors.name ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Descripción
            </label>
            <Textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Descripción de la categoría'
              className={`w-full ${errors.description ? 'border-red-500' : ''}`}
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className='text-red-500 text-sm mt-1'>{errors.description}</p>
            )}
          </div>

          <div className='flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Crear'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
