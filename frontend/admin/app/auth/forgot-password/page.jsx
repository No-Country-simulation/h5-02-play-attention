import { ForgotPassword } from '@/features/auth';

export const metadata = {
  title: 'Recuperar contraseña | Play Attention Admin',
  description:
    'Recupera tu contraseña para acceder al panel de administración de Play Attention'
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
