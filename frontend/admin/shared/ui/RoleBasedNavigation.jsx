import React from 'react';
import Link from 'next/link';
import { useRole } from '@/shared/hooks/useRole';
import { cn } from '@/shared/lib/utils';

/**
 * Configuración de elementos de navegación por rol
 */
const navigationConfig = {
  // Roles disponibles
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'CRM', href: '/crm', icon: 'UsersIcon' },
    { name: 'Tickets', href: '/tickets', icon: 'TicketIcon' },
    { name: 'Usuarios', href: '/users', icon: 'UserGroupIcon' },
    { name: 'Contenido', href: '/content', icon: 'DocumentTextIcon' },
    { name: 'Configuración', href: '/settings', icon: 'CogIcon' }
  ],
  comercial: [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'CRM', href: '/crm', icon: 'UsersIcon' }
  ],
  default: [{ name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' }]
};

/**
 * Componente para mostrar navegación basada en roles
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.activeItem - Elemento activo actual
 * @param {string} props.className - Clases para el contenedor
 * @param {string} props.itemClassName - Clases para cada ítem
 * @param {function} props.renderIcon - Función para renderizar íconos (opcional)
 * @returns {JSX.Element} Navegación basada en roles
 */
export const RoleBasedNavigation = ({
  activeItem,
  className,
  itemClassName,
  renderIcon = icon => null // Función vacía por defecto
}) => {
  const { role, isLoading } = useRole();

  // Determinar los elementos de navegación según el rol
  const userRole = role || 'default';
  const navItems = navigationConfig[userRole] || navigationConfig.default;

  // Si está cargando, mostrar esqueleto de carga
  if (isLoading) {
    return (
      <div className={className}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className='h-10 bg-gray-200 animate-pulse rounded-md mb-2'
          />
        ))}
      </div>
    );
  }

  return (
    <nav className={className}>
      <ul className='space-y-1'>
        {navItems.map(item => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                itemClassName,
                activeItem === item.href
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {renderIcon(item.icon)}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
