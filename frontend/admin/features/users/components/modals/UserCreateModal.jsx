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
    fullname: '',
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

    if (!formData.fullname || !formData.fullname.trim()) {
      newErrors.fullname = 'El nombre es requerido';
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
        // Resetear formulario solo en caso de éxito
        setFormData({
          fullname: '',
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
        // No resetear el formulario en caso de error
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fullname: '',
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
                          htmlFor='fullname'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Nombre
                        </Label>
                        <Input
                          id='fullname'
                          type='text'
                          className={`mt-1 ${
                            errors.fullname ? 'border-red-500' : ''
                          }`}
                          value={formData.fullname}
                          onChange={e =>
                            handleChange('fullname', e.target.value)
                          }
                        />
                        {errors.fullname && (
                          <p className='mt-1 text-xs text-red-500'>
                            {errors.fullname}
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
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <Label
                            htmlFor='role'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Rol del usuario
                          </Label>
                          <Select
                            value={formData.role}
                            onValueChange={value => handleChange('role', value)}
                          >
                            <SelectTrigger
                              className='w-full mt-1'
                              id='role'
                              aria-label='Selecciona el rol'
                            >
                              <SelectValue placeholder='Selecciona rol' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Administrador'>
                                Administrador
                              </SelectItem>
                              <SelectItem value='Comercial'>
                                Comercial
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor='service'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Servicio
                          </Label>
                          <Select
                            value={formData.service}
                            onValueChange={value =>
                              handleChange('service', value)
                            }
                          >
                            <SelectTrigger
                              className='w-full mt-1'
                              id='service'
                              aria-label='Selecciona el servicio'
                            >
                              <SelectValue placeholder='Selecciona servicio' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Individuo'>
                                Individuo
                              </SelectItem>
                              <SelectItem value='Empresa'>Empresa</SelectItem>
                              <SelectItem value='Profesional'>
                                Profesional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor='password'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Contraseña
                        </Label>
                        <div className='relative mt-1'>
                          <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            className={`pr-10 ${
                              errors.password ? 'border-red-500' : ''
                            }`}
                            value={formData.password}
                            onChange={e =>
                              handleChange('password', e.target.value)
                            }
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className='h-5 w-5 text-gray-400' />
                            ) : (
                              <Eye className='h-5 w-5 text-gray-400' />
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
                        <div className='relative mt-1'>
                          <Input
                            id='confirmPassword'
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`pr-10 ${
                              errors.confirmPassword ? 'border-red-500' : ''
                            }`}
                            value={formData.confirmPassword}
                            onChange={e =>
                              handleChange('confirmPassword', e.target.value)
                            }
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className='h-5 w-5 text-gray-400' />
                            ) : (
                              <Eye className='h-5 w-5 text-gray-400' />
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
                className='w-full sm:ml-3 sm:w-auto'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear usuario'}
              </Button>
              <Button
                type='button'
                variant='outline'
                className='mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto'
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
