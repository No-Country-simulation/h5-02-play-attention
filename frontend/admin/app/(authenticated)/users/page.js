'use client';

import UserManagement from '@/features/users/UserManagement';

/**
 * Página de Gestión de Usuarios
 * Siguiendo el principio de Responsabilidad Única (SRP), esta página solo se encarga
 * de renderizar el componente principal de gestión de usuarios
 */
export default function UsersPage() {
  return <UserManagement />;
}
