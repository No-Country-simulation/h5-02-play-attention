'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente de paginación para la tabla de usuarios
 */
const UserPagination = ({
  currentPage,
  totalPages,
  currentCount,
  totalCount,
  pageSize,
  onPrevious,
  onNext
}) => {
  return (
    <div className='flex flex-col lg:flex-row justify-between items-center gap-4 mb-8'>
      <div className='text-xs lg:text-sm text-gray-700 text-center lg:text-left'>
        Mostrando{' '}
        <span className='font-medium'>
          {currentCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
        </span>{' '}
        a{' '}
        <span className='font-medium'>
          {(currentPage - 1) * pageSize + currentCount}
        </span>{' '}
        de <span className='font-medium'>{totalCount}</span> resultados
      </div>
      <div className='flex space-x-2'>
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <ChevronLeft className='h-4 w-4 lg:h-5 lg:w-5' />
        </button>
        <div className='flex items-center justify-center px-2 lg:px-3 h-9 lg:h-10 rounded-md bg-gray-50 text-xs lg:text-sm font-medium'>
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <ChevronRight className='h-4 w-4 lg:h-5 lg:w-5' />
        </button>
      </div>
    </div>
  );
};

export default UserPagination;
