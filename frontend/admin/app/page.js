import { redirect } from 'next/navigation';

/**
 * Página de inicio
 * Redirige automáticamente al dashboard
 */
export default function Home() {
  redirect('/dashboard');
}
