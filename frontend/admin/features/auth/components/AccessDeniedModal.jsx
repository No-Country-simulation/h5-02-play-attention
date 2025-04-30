'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Modal que se muestra cuando un usuario con rol no permitido intenta acceder
 */
export default function AccessDeniedModal({ isOpen, onClose }) {
  const router = useRouter();

  const handleReturnToLogin = () => {
    // Llamar a la API de logout para eliminar la cookie
    fetch('/api/auth/logout', {
      method: 'POST'
    }).then(() => {
      onClose && onClose();
      router.push('/login');
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <div className='flex items-center gap-4'>
          <div className='bg-red-100 p-2 rounded-full'>
            <AlertTriangle className='h-6 w-6 text-red-600' />
          </div>
          <DialogTitle className='text-xl'>Acceso Denegado</DialogTitle>
        </div>

        <DialogDescription className='pt-4 pb-5'>
          Tu cuenta no tiene permisos para acceder al panel de administración.
          Esta plataforma es exclusiva para administradores y personal
          comercial.
          <br />
          <br />
          Si crees que esto es un error, contacta al administrador del sistema.
        </DialogDescription>

        <div className='flex justify-end gap-3'>
          <Button variant='default' onClick={handleReturnToLogin}>
            Volver al inicio de sesión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
