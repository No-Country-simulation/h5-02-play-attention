'use client';

import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente de paginación para la lista de tickets
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de la paginación
 */
export default function TicketPagination({
  currentPage,
  totalPages,
  pageSize,
  totalTickets,
  currentTickets,
  onPreviousPage,
  onNextPage,
  onPageChange
}) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between mt-6 px-4 pb-4 gap-2'>
      <div className='text-xs sm:text-sm text-gray-500 order-2 sm:order-1 text-center sm:text-left'>
        Mostrando{' '}
        <span className='font-medium'>
          {currentTickets > 0 ? (currentPage - 1) * pageSize + 1 : 0}
        </span>{' '}
        a{' '}
        <span className='font-medium'>
          {Math.min(currentPage * pageSize, totalTickets)}
        </span>{' '}
        de <span className='font-medium'>{totalTickets}</span> tickets
      </div>
      <div className='flex space-x-2 justify-center sm:justify-end order-1 sm:order-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className='h-8 w-8 p-0'
          aria-label='Página anterior'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <div className='flex items-center text-xs sm:text-sm px-2 font-medium'>
          {currentPage} de {totalPages || 1}
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={onNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className='h-8 w-8 p-0'
          aria-label='Página siguiente'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
