'use client';

import React from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

/**
 * Search bar component for filtering educational materials
 */
export function SearchBar({ searchQuery, onSearchChange, onSearch }) {
  const handleSubmit = e => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className='flex gap-2 mb-4'>
      <div className='relative flex-grow'>
        <Input
          type='text'
          placeholder='Buscar por título, descripción o palabras clave'
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-indigo-500'
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-4 w-4 text-gray-400'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
      </div>
      <div className='flex gap-2'>
        <Button
          variant='default'
          onClick={onSearch}
          className='bg-indigo-600 text-white hover:bg-indigo-700'
        >
          Buscar
        </Button>
        <Button
          variant='outline'
          onClick={() => onSearchChange('')}
          className='border-gray-300 hover:bg-gray-50 text-gray-700'
        >
          Todos
        </Button>
      </div>
    </div>
  );
}
