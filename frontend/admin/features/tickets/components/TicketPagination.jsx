'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';

/**
 * Componente para la paginación de tickets
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
  // Calcular el rango de resultados que se están mostrando
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + currentTickets - 1, totalTickets);

  // Si no hay resultados o solo hay una página, no mostrar paginación
  if (totalTickets === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className='px-4 py-4 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-4'>
      {/* Información de resultados */}
      <div className='text-sm text-gray-600'>
        Mostrando <span className='font-medium'>{startItem}</span> a{' '}
        <span className='font-medium'>{endItem}</span> de{' '}
        <span className='font-medium'>{totalTickets}</span> resultados
      </div>

      {/* Controles de paginación */}
      <div className='flex items-center space-x-2'>
        {/* Botón de página anterior */}
        <Button
          variant='outline'
          size='sm'
          onClick={onPreviousPage}
          disabled={currentPage <= 1}
          className='h-9 w-9 p-0'
          aria-label='Página anterior'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {/* Contador de páginas (estilo Users) */}
        <div className='flex items-center justify-center px-3 h-9 rounded-md bg-gray-50 text-sm font-medium'>
          {currentPage} / {totalPages}
        </div>

        {/* Botón de página siguiente */}
        <Button
          variant='outline'
          size='sm'
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className='h-9 w-9 p-0'
          aria-label='Página siguiente'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
