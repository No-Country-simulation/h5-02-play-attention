'use client';

import { useState } from 'react';
import { useChangePassword } from '@/shared/hooks/useAuthQuery';
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
import { Loader2, CheckCircle } from 'lucide-react';

// Esquema de validación
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'La contraseña actual debe tener al menos 6 caracteres'),
    newPassword: z
      .string()
      .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'La confirmación debe tener al menos 6 caracteres')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export default function ChangePasswordForm() {
  const router = useRouter();
  const changePasswordMutation = useChangePassword();
  const [authError, setAuthError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async data => {
    setAuthError(null);
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setIsSuccess(true);
    } catch (error) {
      setAuthError(error.message || 'Error al cambiar la contraseña');
    }
  };

  // Mostrar pantalla de éxito
  if (isSuccess) {
    return (
      <Card className='w-full max-w-md mx-auto shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Contraseña Actualizada
          </CardTitle>
          <CardDescription className='text-center'>
            Tu contraseña ha sido actualizada exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center space-y-4'>
          <CheckCircle className='h-16 w-16 text-green-500' />
          <p className='text-center text-sm text-muted-foreground'>
            Ya puedes usar tu nueva contraseña para iniciar sesión
          </p>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button onClick={() => router.push('/dashboard')} className='mt-4'>
            Volver al panel
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md mx-auto shadow-lg'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center'>
          Cambiar Contraseña
        </CardTitle>
        <CardDescription className='text-center'>
          Ingresa tu contraseña actual y la nueva contraseña
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
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña Actual</FormLabel>
                  <FormControl>
                    <Input placeholder='••••••••' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder='••••••••' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder='••••••••' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full mt-6'
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Cambiar Contraseña
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
