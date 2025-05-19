'use client';

import { useState, useEffect, useRef } from 'react';
import { useLogout } from '../hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { User, Settings, LogOut, HelpCircle, Bell, Menu } from 'lucide-react';
import Link from 'next/link';

/**
 * Componente de menú de usuario para el header
 * @returns {JSX.Element} Componente de React
 */
function UserMenu() {
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Detectar si estamos en el cliente
  useEffect(() => {
    setIsClient(true);

    // Leer la cookie en el cliente
    try {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_info='));

      if (userCookie) {
        const userInfoValue = userCookie.split('=')[1];
        const parsedUserInfo = JSON.parse(decodeURIComponent(userInfoValue));
        setUserData(parsedUserInfo);
      }
    } catch (error) {
      console.error('Error al leer cookie user_info:', error);
    }
  }, []);

  // No renderizar nada en el servidor o si no hay datos de usuario
  if (!isClient || !userData) {
    return null;
  }

  const { name, email, role } = userData;

  // Obtener iniciales para el avatar
  const getInitials = () => {
    if (!name) return email?.substring(0, 2).toUpperCase() || '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    setOpen(false);
    logout.mutate();
  };

  // Texto a mostrar para el rol
  const roleText = role === 'Admin' ? 'Administrador' : role;

  return (
    // Solo mostrar en vista de escritorio
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className='flex items-center space-x-2 rounded-full focus:outline-none'>
            <Avatar className='h-8 w-8 cursor-pointer'>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${
                  name || email
                }&background=4a148c&color=fff`}
                alt={name || email}
              />
              <AvatarFallback className='bg-sidebar text-white'>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start'>
              <span className='text-sm font-medium leading-tight'>
                {name || email}
              </span>
              <span className='text-xs text-gray-500 leading-tight'>
                {roleText}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {name || 'Usuario'}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem >
              <Link href="/profile" className="flex items-start">              
                <User className='mr-2 h-4 w-4' />
                <span>Perfil</span>
              </Link>                                          
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className='mr-2 h-4 w-4' />
              <span>Notificaciones</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HelpCircle className='mr-2 h-4 w-4' />
            <span>Ayuda</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={logout.isPending}>
            <LogOut className='mr-2 h-4 w-4' />
            <span>
              {logout.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserMenu;
