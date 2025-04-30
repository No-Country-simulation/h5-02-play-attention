'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import Link from 'next/link';

/**
 * Componente de formulario para recuperación de contraseña
 * @returns {JSX.Element} Componente de React
 */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Error al solicitar recuperación de contraseña'
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-center'>
                Recuperar contraseña
              </h2>
              <p className='text-sm text-gray-500 text-center mt-2'>
                Ingresa tu correo electrónico y te enviaremos instrucciones para
                restablecer tu contraseña.
              </p>
            </div>

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
              placeholder='nombre@ejemplo.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='border-purple-200 focus:border-purple-500 focus:ring-purple-500'
            />
          </div>

          {error && (
            <Alert variant='destructive' className='py-2'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            disabled={isLoading}
            className='w-full bg-purple-600 hover:bg-purple-700 text-white'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Enviando...
              </>
            ) : (
              'Enviar instrucciones'
            )}
          </Button>

          <div className='text-center mt-4'>
            <Link
              href='/login'
              className='text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center'
            >
              <ArrowLeft className='h-4 w-4 mr-1' />
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      ) : (
        <div className='text-center py-8'>
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4'>
            <svg
              className='h-6 w-6 text-green-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900'>
            ¡Correo enviado!
          </h3>
          <p className='mt-2 text-sm text-gray-500 max-w-md mx-auto'>
            Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
            <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada (y
            carpeta de spam) para continuar con el proceso.
          </p>
          <div className='mt-6'>
            <Link
              href='/login'
              className='text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center'
            >
              <ArrowLeft className='h-4 w-4 mr-1' />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
