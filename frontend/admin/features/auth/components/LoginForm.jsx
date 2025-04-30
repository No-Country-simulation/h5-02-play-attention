'use client';

import { useState } from 'react';
import { useLogin } from '../hooks';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import AccessDeniedModal from './AccessDeniedModal';

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
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-sm font-medium'>
              Email
            </Label>
            <div className='relative'>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                placeholder='tu@email.com'
                value={credentials.email}
                onChange={handleChange}
                className='border-purple-200 focus:border-purple-500 focus:ring-purple-500'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password' className='text-sm font-medium'>
                Contraseña
              </Label>
              <a
                href='#'
                className='text-xs font-medium text-purple-600 hover:text-purple-500'
              >
                ¿Olvidaste tu contraseña?
              </a>
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
                className='pr-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center pr-3 text-purple-500 hover:text-purple-700'
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
          className='w-full bg-purple-600 hover:bg-purple-700 text-white'
        >
          {login.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión'
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
