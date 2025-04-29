'use client';

import { useState } from 'react';
import { useLogin } from '../hooks';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { AtSign, Lock, Loader2 } from 'lucide-react';
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

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-sm font-medium'>
              Email
            </Label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <AtSign className='h-5 w-5' />
              </div>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                placeholder='tu@email.com'
                value={credentials.email}
                onChange={handleChange}
                className='pl-10'
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
                className='text-xs font-medium text-indigo-600 hover:text-indigo-500'
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <Lock className='h-5 w-5' />
              </div>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                placeholder='••••••••'
                value={credentials.password}
                onChange={handleChange}
                className='pl-10'
              />
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

        <Button type='submit' disabled={login.isPending} className='w-full'>
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
