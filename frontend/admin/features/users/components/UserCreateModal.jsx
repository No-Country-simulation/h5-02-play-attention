'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

/**
 * Componente para el modal de creación de usuarios
 * Este es un componente placeholder para una futura implementación
 * Actualmente la funcionalidad está integrada directamente en UserManagement
 */
export default function UserCreateModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Usuario',
    service: 'Individuo',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar errores al editar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Si el usuario está cambiando el email, quitamos el indicador de email ya existente
    if (field === 'email') {
      setEmailAlreadyExists(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        // Resetear formulario
        setFormData({
          name: '',
          email: '',
          role: 'Usuario',
          service: 'Individuo',
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error al crear usuario:', error);
        // Si el error es que el email ya existe, mostramos un indicador visual
        if (error.message && error.message.includes('Email ya registrado')) {
          setEmailAlreadyExists(true);
          setErrors({
            ...errors,
            email: 'Este email ya está registrado en el sistema'
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Usuario',
      service: 'Individuo',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <form onSubmit={handleSubmit}>
            <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>
                    Crear nuevo usuario
                  </h3>
                  <div className='mt-2'>
                    <div className='space-y-4'>
                      <div>
                        <Label
                          htmlFor='name'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Nombre
                        </Label>
                        <Input
                          id='name'
                          type='text'
                          className={`mt-1 ${
                            errors.name ? 'border-red-500' : ''
                          }`}
                          value={formData.name}
                          onChange={e => handleChange('name', e.target.value)}
                        />
                        {errors.name && (
                          <p className='mt-1 text-xs text-red-500'>
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor='email'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Correo electrónico
                        </Label>
                        <Input
                          id='email'
                          type='email'
                          className={`mt-1 ${
                            errors.email || emailAlreadyExists
                              ? 'border-red-500'
                              : ''
                          }`}
                          value={formData.email}
                          onChange={e => handleChange('email', e.target.value)}
                        />
                        {errors.email && (
                          <p className='mt-1 text-xs text-red-500'>
                            {errors.email}
                          </p>
                        )}
                        {emailAlreadyExists && !errors.email && (
                          <p className='mt-1 text-xs text-red-500'>
                            Este email ya está registrado en el sistema
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor='role'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Rol
                        </Label>
                        <Select
                          value={formData.role}
                          onValueChange={value => handleChange('role', value)}
                        >
                          <SelectTrigger id='role' className='w-full'>
                            <SelectValue placeholder='Seleccionar rol' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Usuario'>Usuario</SelectItem>
                            <SelectItem value='Comercial'>Comercial</SelectItem>
                            <SelectItem value='Admin'>Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='mt-1 text-xs text-gray-500'>
                          El rol determina qué acciones puede realizar el
                          usuario. Los permisos específicos se configuran en la
                          sección "Permisos y Roles".
                        </p>
                      </div>
                      <div>
                        <Label
                          htmlFor='service'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Tipo de Servicio
                        </Label>
                        <Select
                          value={formData.service}
                          onValueChange={value =>
                            handleChange('service', value)
                          }
                        >
                          <SelectTrigger id='service' className='w-full'>
                            <SelectValue placeholder='Seleccionar servicio' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Individuo'>Individuo</SelectItem>
                            <SelectItem value='Empresa'>Empresa</SelectItem>
                            <SelectItem value='Profesional'>
                              Profesional
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor='password'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Contraseña
                        </Label>
                        <div className='relative'>
                          <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            className={`mt-1 pr-10 ${
                              errors.password ? 'border-red-500' : ''
                            }`}
                            value={formData.password}
                            onChange={e =>
                              handleChange('password', e.target.value)
                            }
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 mt-1 pr-3 flex items-center text-gray-400 hover:text-gray-500'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className='h-5 w-5' />
                            ) : (
                              <Eye className='h-5 w-5' />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className='mt-1 text-xs text-red-500'>
                            {errors.password}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor='confirmPassword'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Confirmar contraseña
                        </Label>
                        <div className='relative'>
                          <Input
                            id='confirmPassword'
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`mt-1 pr-10 ${
                              errors.confirmPassword ? 'border-red-500' : ''
                            }`}
                            value={formData.confirmPassword}
                            onChange={e =>
                              handleChange('confirmPassword', e.target.value)
                            }
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 mt-1 pr-3 flex items-center text-gray-400 hover:text-gray-500'
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className='h-5 w-5' />
                            ) : (
                              <Eye className='h-5 w-5' />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className='mt-1 text-xs text-red-500'>
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear'}
              </Button>
              <Button
                type='button'
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
