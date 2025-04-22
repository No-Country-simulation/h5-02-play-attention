'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash,
  UserCog,
  Ban,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { formatDate } from '@/shared/lib/utils';

/**
 * Componente para mostrar la tabla de usuarios
 * Este es un componente placeholder para una futura implementación
 * Actualmente la funcionalidad está integrada directamente en UserManagement
 */
export default function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading
}) {
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getStatusIcon = status => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className='h-5 w-5 text-green-500' />;
      case 'inactive':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default:
        return null;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

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

  // Función para obtener las iniciales del usuario para el avatar
  const getUserInitials = name => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusBadge = status => {
    const statusConfig = {
      active: { variant: 'success', label: 'Activo' },
      inactive: { variant: 'secondary', label: 'Inactivo' },
      banned: { variant: 'destructive', label: 'Bloqueado' }
    };

    const config = statusConfig[status] || {
      variant: 'outline',
      label: status
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = role => {
    const roleConfig = {
      admin: { variant: 'default', label: 'Administrador' },
      teacher: { variant: 'outline', label: 'Profesor' },
      student: { variant: 'secondary', label: 'Estudiante' }
    };

    const config = roleConfig[role] || { variant: 'outline', label: role };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActionItems = user => {
    const items = [
      {
        label: 'Ver detalles',
        icon: <Eye className='mr-2 h-4 w-4' />,
        onClick: () => onView(user)
      },
      {
        label: 'Editar',
        icon: <Edit className='mr-2 h-4 w-4' />,
        onClick: () => onEdit(user)
      }
    ];

    // Acciones según el estado actual
    if (user.status === 'active') {
      items.push({
        label: 'Desactivar',
        icon: <Ban className='mr-2 h-4 w-4' />,
        onClick: () => onStatusChange(user.id, 'inactive')
      });
    } else if (user.status === 'inactive' || user.status === 'banned') {
      items.push({
        label: 'Activar',
        icon: <Check className='mr-2 h-4 w-4' />,
        onClick: () => onStatusChange(user.id, 'active')
      });
    }

    // Solo agregar la opción de eliminar si no es el usuario actual
    items.push({
      label: 'Eliminar',
      icon: <Trash className='mr-2 h-4 w-4' />,
      onClick: () => onDelete(user.id),
      className: 'text-destructive hover:text-destructive'
    });

    return items;
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-muted-foreground'>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[80px]'>Avatar</TableHead>
            <TableHead className='min-w-[150px]'>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className='text-right'>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className='font-medium'>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Abrir menú</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {getActionItems(user).map((item, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={item.onClick}
                        className={item.className}
                      >
                        {item.icon}
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
