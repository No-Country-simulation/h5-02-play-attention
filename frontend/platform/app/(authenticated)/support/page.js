import SupportPage from '@/features/support/SupportPage';
import { Suspense } from 'react';

export default function SupportRoute() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SupportPage />
    </Suspense>
  );
}
