'use client';

import { useState } from 'react';
import { useLogin } from '../hooks';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import AccessDeniedModal from './AccessDeniedModal';
import Link from 'next/link';

/**
 * Componente de formulario de login
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.redirectUrl] - URL a la que redirigir después del login
 * @returns {JSX.Element} Componente de React
 */
export default function LoginForm({ redirectUrl = '/dashboard' }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin(redirectUrl);

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await login.mutate(credentials);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <Label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Correo electrónico
          </Label>
          <Input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
            placeholder='admin@gmail.com'
            value={credentials.email}
            onChange={handleChange}
            className='w-full h-10 rounded shadow-sm border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-purple-500'
          />
        </div>

        <div>
          <div className='flex items-center justify-between mb-1'>
            <Label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Contraseña
            </Label>
            <div className='text-xs'>
              <Link
                href='/forgot-password'
                className='font-medium text-purple-600 hover:text-purple-500'
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <div className='relative'>
            <Input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              required
              placeholder='••••••••'
              value={credentials.password}
              onChange={handleChange}
              className='w-full h-10 rounded shadow-sm border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-purple-500 pr-10'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>

        {login.isError && (
          <Alert variant='destructive' className='py-2'>
            <AlertDescription>
              {login.error?.message || 'Error al iniciar sesión'}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type='submit'
          disabled={login.isPending}
          className='w-full h-10 bg-purple-800 hover:bg-purple-900 text-white rounded'
        >
          {login.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </form>

      {/* Modal de acceso denegado */}
      <AccessDeniedModal
        isOpen={login.showAccessDenied}
        onClose={login.closeAccessDenied}
      />
    </>
  );
}
