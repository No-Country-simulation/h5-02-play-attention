'use client';

import ChangePasswordForm from './components/ChangePasswordForm';
import PageHeader from '@/shared/ui/page-header';

export default function ChangePassword() {
  return (
    <div className='container py-8'>
      <PageHeader
        title='Cambiar Contraseña'
        description='Actualiza tu contraseña para mantener tu cuenta segura'
      />
      <div className='mt-8 flex justify-center'>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
