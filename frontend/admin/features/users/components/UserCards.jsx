'use client';

import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  UserCog
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { formatDate } from '@/shared/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function UserCards({ users = [], onEdit, onStatusChange, onDelete }) {
  // Función para obtener el color de la insignia según el estado
  const getBadgeVariant = status => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'banned':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Función para obtener el texto del estado en español
  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'banned':
        return 'Bloqueado';
      default:
        return status;
    }
  };

  // Función para obtener las iniciales del usuario para el avatar
  const getUserInitials = name => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {users.map(user => (
        <Card key={user.id}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{user.role}</CardTitle>
            <Badge variant={getBadgeVariant(user.status)}>
              {getStatusText(user.status)}
            </Badge>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-medium leading-none'>{user.name}</p>
                <p className='text-sm text-muted-foreground mt-1'>
                  {user.email}
                </p>
              </div>
            </div>
            <div className='mt-3 text-xs text-muted-foreground'>
              Creado: {formatDate(user.createdAt)}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between pt-0'>
            <Button variant='outline' size='sm' onClick={() => onEdit(user)}>
              <Edit className='mr-2 h-3 w-3' />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Abrir menú</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {user.status !== 'active' && (
                  <DropdownMenuItem
                    onClick={() => onStatusChange(user.id, 'active')}
                  >
                    <CheckCircle className='mr-2 h-4 w-4' />
                    <span>Activar</span>
                  </DropdownMenuItem>
                )}

                {user.status !== 'inactive' && (
                  <DropdownMenuItem
                    onClick={() => onStatusChange(user.id, 'inactive')}
                  >
                    <XCircle className='mr-2 h-4 w-4' />
                    <span>Desactivar</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className='text-destructive focus:text-destructive'
                  onClick={() => onDelete(user.id)}
                >
                  <Trash className='mr-2 h-4 w-4' />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
