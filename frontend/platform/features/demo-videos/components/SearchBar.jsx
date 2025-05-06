import { Filter, LucideFilter } from 'lucide-react';
import React, { useState } from 'react';

export function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  fileType,
  onFileTypeChange,
  dateSort,
  onDateSortChange
}) {
  const [showFilters, setShowFilters] = useState(false);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const fileTypes = ['Todos', 'PDF', 'VIDEO', 'IMAGEN', 'DOC'];

  return (
    <div className='mb-6'>
      {/* Vista móvil: Búsqueda simple + botón de filtros */}
      <div className='md:hidden'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='relative flex-grow'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Buscar...'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
              <svg
                className='h-5 w-5 text-gray-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='px-3 py-2 border border-gray-300 bg-white rounded-md flex items-center'
          >
            <Filter className='text-gray-500' />
          </button>
        </div>

        {/* Filtros expandibles para móvil */}
        {showFilters && (
          <div className='flex flex-col gap-3 mb-3 bg-gray-50 p-3 rounded-md'>
            {/* Selector de Tipo */}
            <div className='w-full'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tipo
              </label>
              <div className='relative'>
                <select
                  value={fileType}
                  onChange={e => onFileTypeChange(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none'
                >
                  {fileTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                  <Filter className='text-gray-500' fontSize='small' />
                </div>
              </div>
            </div>

            {/* Selector de Fecha */}
            <div className='w-full'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Ordenar por fecha
              </label>
              <div className='relative'>
                <select
                  value={dateSort}
                  onChange={e => onDateSortChange(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none'
                >
                  <option value='newest'>Más reciente primero</option>
                  <option value='oldest'>Más antiguo primero</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                  <LucideFilter className='text-gray-500' fontSize='small' />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vista desktop: Búsqueda y filtros en línea */}
      <div className='hidden md:block'>
        <div className='flex items-center gap-2'>
          <div className='relative flex-grow'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Buscar por título, descripción o etiqueta'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
              <svg
                className='h-5 w-5 text-gray-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>          

          {/* Selector de Fecha */}
          <div className='relative'>
            <button className='px-4 py-2 border border-gray-300 bg-white rounded-md flex items-center gap-2'>
              <Filter />
              fecha
            </button>
            <select
              value={dateSort}
              onChange={e => onDateSortChange(e.target.value)}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            >
              <option value='newest'>Más reciente primero</option>
              <option value='oldest'>Más antiguo primero</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 