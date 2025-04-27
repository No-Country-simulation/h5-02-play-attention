'use client';

import {
  Search,
  PlusCircle,
  Download,
  LayoutGrid,
  LayoutList
} from 'lucide-react';

/**
 * Componente de barra de herramientas para la gestión de usuarios
 */
const UserToolbar = ({
  searchTerm,
  onSearchChange,
  onCreateClick,
  onExportClick,
  viewLayout,
  onViewLayoutChange
}) => {
  return (
    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 mt-8'>
      {/* Búsqueda */}
      <div className='relative w-full lg:w-auto'>
        <input
          type='text'
          placeholder='Buscar usuarios...'
          className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full lg:w-80'
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
        <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
      </div>

      {/* Botones de acción */}
      <div className='flex gap-2 w-full lg:w-auto'>
        {/* Selector de vista */}
        <div className='flex mr-2 rounded-lg overflow-hidden border border-gray-300'>
          <button
            className={`flex items-center justify-center p-1.5 h-8 w-8 ${
              viewLayout === 'list'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onViewLayoutChange('list')}
            aria-label='Vista de lista'
          >
            <LayoutList className='h-4 w-4' />
          </button>
          <button
            className={`flex items-center justify-center p-1.5 h-8 w-8 ${
              viewLayout === 'grouped'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onViewLayoutChange('grouped')}
            aria-label='Vista agrupada'
          >
            <LayoutGrid className='h-4 w-4' />
          </button>
        </div>

        <button
          className='flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 text-white text-sm rounded-lg hover:bg-purple-800 transition-colors'
          onClick={onCreateClick}
        >
          <PlusCircle className='h-4 w-4' />
          <span>Nuevo Usuario</span>
        </button>

        <button
          className='flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-sm rounded-lg bg-white hover:bg-gray-50 transition-colors'
          onClick={onExportClick}
        >
          <Download className='h-4 w-4' />
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
};

export default UserToolbar;
