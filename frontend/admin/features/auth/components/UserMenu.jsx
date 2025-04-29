'use client';

import { useState, useEffect } from 'react';
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
import { User, Settings, LogOut, HelpCircle, Bell } from 'lucide-react';

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
        console.log('UserMenu: datos de usuario cargados:', parsedUserInfo);
      } else {
        console.log('UserMenu: no se encontró la cookie user_info');
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

  console.log('UserMenu: renderizando componente');

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'>
          <Avatar className='h-8 w-8 cursor-pointer'>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${
                name || email
              }&background=6366f1&color=fff`}
              alt={name || email}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <span className='text-sm font-medium hidden md:inline-block'>
            {name || email}
          </span>
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
            <p className='text-xs leading-none text-muted-foreground'>
              {role === 'Admin' ? 'Administrador' : role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className='mr-2 h-4 w-4' />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className='mr-2 h-4 w-4' />
            <span>Configuración</span>
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
  );
}

export default UserMenu;
