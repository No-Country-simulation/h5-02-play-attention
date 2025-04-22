'use client';

import { useState } from 'react';
import { UserTable } from './UserTable';
import { UserCards } from './UserCards';
import { Pagination } from '@/shared/ui/pagination';
import { Skeleton } from '@/shared/ui/skeleton';

export default function UsersDataView({
  users = [],
  isLoading = false,
  totalUsers = 0,
  viewMode = 'table',
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onEdit,
  onStatusChange,
  onDelete
}) {
  // Calcular número total de páginas
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Renderizar skeleton loader si está cargando
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='rounded-md border'>
          <div className='p-4'>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex items-center space-x-4 py-4'>
                  <Skeleton className='h-12 w-12 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-[250px]' />
                    <Skeleton className='h-4 w-[200px]' />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Si no hay usuarios
  if (users.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='rounded-full bg-muted p-6 mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-10 w-10 text-muted-foreground'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium'>No se encontraron usuarios</h3>
        <p className='text-sm text-muted-foreground mt-1'>
          Intenta modificar los filtros de búsqueda o crea un nuevo usuario.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {viewMode === 'table' ? (
        <UserTable
          users={users}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ) : (
        <UserCards
          users={users}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      )}

      {totalPages > 1 && (
        <div className='flex items-center justify-end py-4'>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
