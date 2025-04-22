'use client';

import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function UserPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems
}) {
  const pageSizeOptions = [10, 20, 50, 100];

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageRangeDisplay = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return `${start}-${end} de ${totalItems}`;
  };

  return (
    <div className='flex flex-col-reverse items-center justify-between gap-4 py-2 sm:flex-row'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <span>Mostrar</span>
        <Select
          value={pageSize.toString()}
          onValueChange={value => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className='h-8 w-16'>
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>por página</span>
      </div>

      <div className='flex items-center justify-center gap-1 sm:justify-end'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          {totalItems ? getPageRangeDisplay() : 'No hay usuarios'}
        </div>
        <Button
          variant='outline'
          size='icon'
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className='h-8 w-8'
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Página anterior</span>
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={handleNext}
          disabled={currentPage >= totalPages || totalPages === 0}
          className='h-8 w-8'
        >
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Página siguiente</span>
        </Button>
      </div>
    </div>
  );
}
