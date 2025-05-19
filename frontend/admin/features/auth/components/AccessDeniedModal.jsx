'use client';

import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { X } from 'lucide-react';
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
      <DialogContent className='sm:max-w-md p-8 rounded-lg'>
        <div className='flex flex-col items-center text-center'>
          <div className='flex justify-center mb-4'>
            <div className='bg-white rounded-full border-4 border-red-600 p-2'>
              <X className='h-8 w-8 text-red-600' />
            </div>
          </div>

          <h2 className='text-xl font-semibold mb-3'>Acceso denegado</h2>

          <p className='text-sm text-gray-600 mb-6'>
            Tu cuenta no tiene permisos para acceder al panel del administrador.
            Si crees que esto es un error, contacta al administrador del
            sistema.
          </p>

          <Button
            variant='default'
            onClick={handleReturnToLogin}
            className='bg-purple-800 hover:bg-purple-900 text-white w-full py-2'
          >
            Volver a Iniciar Sesión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
