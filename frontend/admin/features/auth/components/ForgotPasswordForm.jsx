'use client';

import { useState } from 'react';
import { useForgotPassword } from '@/shared/hooks/useAuthQuery';
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
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

// Esquema de validación
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es requerido')
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const [authError, setAuthError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async data => {
    setAuthError(null);
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setIsSuccess(true);
    } catch (error) {
      setAuthError(
        error.message || 'Error al solicitar recuperación de contraseña'
      );
    }
  };

  // Mostrar pantalla de éxito
  if (isSuccess) {
    return (
      <Card className='w-full max-w-md mx-auto shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Solicitud Enviada
          </CardTitle>
          <CardDescription className='text-center'>
            Hemos enviado instrucciones para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center space-y-4'>
          <CheckCircle className='h-16 w-16 text-green-500' />
          <p className='text-center text-sm text-muted-foreground'>
            Por favor revisa tu correo electrónico y sigue las instrucciones
            para crear una nueva contraseña.
          </p>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button
            variant='outline'
            onClick={() => router.push('/auth/login')}
            className='mt-4'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver al inicio de sesión
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md mx-auto shadow-lg'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center'>
          Recuperar Contraseña
        </CardTitle>
        <CardDescription className='text-center'>
          Ingresa tu email para recibir instrucciones de recuperación
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

            <Button
              type='submit'
              className='w-full mt-6'
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Enviar Instrucciones
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button
          variant='link'
          className='text-sm text-primary'
          onClick={() => router.push('/auth/login')}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver al inicio de sesión
        </Button>
      </CardFooter>
    </Card>
  );
}
