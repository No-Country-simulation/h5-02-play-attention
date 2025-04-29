import { ChangePassword } from '@/features/auth';

export const metadata = {
  title: 'Cambiar contraseña | Play Attention Admin',
  description:
    'Cambia tu contraseña en el panel de administración de Play Attention'
};

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
