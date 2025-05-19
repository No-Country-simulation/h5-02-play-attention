'use client';

import { useLogout } from '../hooks';

/**
 * Botón para cerrar sesión
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element} Componente de React
 */
export default function LogoutButton({ className = '' }) {
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logout.isPending}
      className={`text-sm font-medium ${className}`}
    >
      {logout.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  );
}
