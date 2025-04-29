'use client';

import { useState } from 'react';
import { useAuth } from '@/shared/hooks/useNextAuth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Componentes UI
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';

// Esquema de validación
const loginSchema = z.object({
  email: z
    .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Importamos la configuración de la API
import { API_ENDPOINTS } from '@/shared/lib/api/config';

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, loginMutation } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);

  // Obtener la URL de callback si existe
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Extraer la URL base de la API para mostrarla en caso de error
  const apiBaseUrl = API_ENDPOINTS.auth.login.split('/api/')[0];

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async data => {
    setAuthError(null);
    setIsDebugging(false);

    try {
      console.log('Iniciando proceso de login...');
      await login(
        {
          email: data.email,
          password: data.password
        },
        decodeURIComponent(callbackUrl)
      );
    } catch (error) {
      console.error('Error de login:', error);
      setAuthError(
        `Error al iniciar sesión: ${error.message || 'Error desconocido'}.
         URL del backend: ${apiBaseUrl}`
      );
      setIsDebugging(true);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto shadow-lg'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center'>
          Iniciar Sesión
        </CardTitle>
        <CardDescription className='text-center'>
          Ingresa tus credenciales para acceder al panel de administración
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {authError && (
              <Alert variant='destructive'>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {isDebugging && (
              <Alert
                variant='default'
                className='bg-amber-50 border-amber-300 text-amber-800 text-xs'
              >
                <AlertDescription>
                  <p>Información de depuración:</p>
                  <p>
                    • Revisa la consola del navegador (F12) para más detalles
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='tu@email.com' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder='••••••••' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full mt-6' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Iniciar Sesión
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button
          variant='link'
          className='text-sm text-primary'
          onClick={() => router.push('/auth/forgot-password')}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </CardFooter>
    </Card>
  );
}
