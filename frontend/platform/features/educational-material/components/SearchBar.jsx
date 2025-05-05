import React from 'react';
import TuneIcon from '@mui/icons-material/Tune';

export function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  fileType,
  onFileTypeChange,
  dateSort,
  onDateSortChange
}) {
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const fileTypes = ['Todos', 'PDF', 'VIDEO', 'IMAGEN', 'DOC'];

  return (
    <div className='mb-6'>
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

        {/* Selector de Tipo */}
        <div className='relative'>
          <button className='px-4 py-2 border border-gray-300 bg-white rounded-md flex items-center gap-2'>
          <TuneIcon />
            Tipo
          </button>
          <select
            value={fileType}
            onChange={e => onFileTypeChange(e.target.value)}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          >
            {fileTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Fecha */}
        <div className='relative'>
          <button className='px-4 py-2 border border-gray-300 bg-white rounded-md flex items-center gap-2'>
            <TuneIcon />
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
  );
}
