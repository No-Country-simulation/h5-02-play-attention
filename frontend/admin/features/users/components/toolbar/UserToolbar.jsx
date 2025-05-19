'use client';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Search, Plus, Download, LayoutGrid, LayoutList } from 'lucide-react';
import UserSortSelect from '../filters/UserSortSelect';

/**
 * Componente de barra de herramientas para la gestión de usuarios
 */
const UserToolbar = ({
  searchTerm,
  onSearchChange,
  onCreateClick,
  onExportClick,
  viewLayout,
  onViewLayoutChange,
  sortOrder,
  onSortChange
}) => {
  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-between items-center mb-6'>
      {/* Búsqueda y ordenamiento */}
      <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
        <div className='relative w-full sm:w-[300px]'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4' />
          <Input
            type='text'
            placeholder='Buscar usuarios...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>
        <UserSortSelect value={sortOrder} onValueChange={onSortChange} />
      </div>

      {/* Acciones */}
      <div className='flex gap-2 w-full sm:w-auto justify-end'>
        <Button
          variant={viewLayout === 'list' ? 'default' : 'outline'}
          size='icon'
          onClick={() => onViewLayoutChange('list')}
          className='h-10 w-10'
        >
          <LayoutList className='h-4 w-4' />
        </Button>
        <Button
          variant={viewLayout === 'grid' ? 'default' : 'outline'}
          size='icon'
          onClick={() => onViewLayoutChange('grid')}
          className='h-10 w-10'
        >
          <LayoutGrid className='h-4 w-4' />
        </Button>
        <Button variant='outline' onClick={onExportClick}>
          <Download className='h-4 w-4 mr-2' />
          Exportar
        </Button>
        <Button onClick={onCreateClick}>
          <Plus className='h-4 w-4 mr-2' />
          Nuevo Usuario
        </Button>
      </div>
    </div>
  );
};

export default UserToolbar;
