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

  // Generar array con los números de página a mostrar
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Máximo de páginas a mostrar

    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un subconjunto
      const leftOffset = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(currentPage - leftOffset, 1);
      const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

      // Ajustar la página de inicio si es necesario
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }

      // Mostrar "1 ..." si no estamos al principio
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }

      // Mostrar las páginas centrales
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(i);
        }
      }

      // Mostrar "... N" si no estamos al final
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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
      <div className='flex items-center space-x-1'>
        {/* Botón de página anterior */}
        <Button
          variant='outline'
          size='sm'
          onClick={onPreviousPage}
          disabled={currentPage <= 1}
          className='h-8 w-8 p-0'
          aria-label='Página anterior'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {/* Números de página */}
        <div className='flex space-x-1'>
          {generatePageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className='h-8 w-8 flex items-center justify-center text-gray-500'
                >
                  ...
                </div>
              );
            }

            return (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? 'default' : 'outline'}
                size='sm'
                onClick={() => onPageChange(page)}
                className='h-8 w-8 p-0'
                aria-label={`Ir a página ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Botón de página siguiente */}
        <Button
          variant='outline'
          size='sm'
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className='h-8 w-8 p-0'
          aria-label='Página siguiente'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
