'use client';

import { AuthProtection } from '@/shared/ui/auth-protection';

/**
 * Layout para todas las rutas protegidas que requieren autenticación
 */
export default function ProtectedLayout({ children }) {
  return <AuthProtection>{children}</AuthProtection>;
}
