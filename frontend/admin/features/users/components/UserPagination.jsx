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
    <div className='flex justify-between items-center mb-8'>
      <div className='text-sm text-gray-700'>
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
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <ChevronLeft className='h-5 w-5' />
        </button>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <ChevronRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
};

export default UserPagination;
