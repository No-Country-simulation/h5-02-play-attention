'use client';

import { useLogout } from '@/shared/hooks/useAuthQuery';
import { useUser } from '@/shared/hooks';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { LogOut, User, Settings, Key } from 'lucide-react';

/**
 * Componente que muestra la información del usuario logueado en el header
 * con un menú desplegable para acciones relacionadas con el perfil
 */
export default function UserMenu() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // Si está cargando, mostrar un esqueleto
  if (isLoading) {
    return (
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <div className='space-y-1.5'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada
  if (!user) return null;

  // Obtener iniciales para el fallback del avatar
  const getInitials = () => {
    if (!user.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex items-center gap-2 p-1 px-2 -mr-2 h-auto hover:bg-accent rounded-lg'
        >
          <div className='flex flex-col items-end mr-2'>
            <span className='font-medium text-sm'>
              {user.name || user.email || 'Usuario'}
            </span>
            <span className='text-xs text-muted-foreground'>
              {user.role || 'Usuario'}
            </span>
          </div>
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name || 'Usuario'} />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className='mr-2 h-4 w-4' />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile/settings')}>
          <Settings className='mr-2 h-4 w-4' />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/auth/change-password')}>
          <Key className='mr-2 h-4 w-4' />
          Cambiar contraseña
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
