'use client';

import { PlusIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

export default function UserToolbar({
  onCreateUser,
  onRefresh,
  onViewChange,
  viewMode = 'table',
  isLoading = false
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <div className='flex justify-between items-center mb-4'>
      <div>
        <h1 className='text-xl font-bold'>Usuarios</h1>
        <p className='text-sm text-muted-foreground'>
          Gestiona los usuarios del sistema
        </p>
      </div>

      <div className='flex gap-2'>
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                Ver como: {viewMode === 'table' ? 'Tabla' : 'Tarjetas'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => onViewChange('table')}
                disabled={viewMode === 'table'}
              >
                Tabla
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onViewChange('cards')}
                disabled={viewMode === 'cards'}
              >
                Tarjetas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant='outline'
          size='sm'
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          <span className='hidden sm:inline'>Actualizar</span>
        </Button>

        <Button size='sm' onClick={onCreateUser}>
          <PlusIcon className='h-4 w-4 mr-2' />
          <span className='hidden sm:inline'>Nuevo Usuario</span>
        </Button>
      </div>
    </div>
  );
}
