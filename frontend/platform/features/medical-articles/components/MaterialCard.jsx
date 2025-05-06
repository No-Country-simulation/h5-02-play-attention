'use client';

import React from 'react';
import { Button } from '@/shared/ui/button';

/**
 * Card component for displaying an educational material item
 */
export function MaterialCard({ material, onDownload }) {
  return (
    <tr className='hover:bg-gray-50'>
      <td className='py-4 px-4 text-gray-900 border-b border-gray-200'>
        {material.title}
      </td>
      <td className='py-4 px-4 text-center border-b border-gray-200'>
        <span className='bg-indigo-100 rounded px-2 py-1 text-xs text-indigo-800'>
          {material.type}
        </span>
      </td>
      <td className='py-4 px-4 text-center border-b border-gray-200'>
        {material.date}
      </td>
      <td className='py-4 px-4 text-center border-b border-gray-200'>
        {material.size}
      </td>
      <td className='py-4 px-4 text-right border-b border-gray-200'>
        <Button
          size='sm'
          onClick={() => onDownload(material, 'view')}
          className='bg-indigo-600 text-white hover:bg-indigo-700 rounded-md'
        >
          Ver
        </Button>
      </td>
    </tr>
  );
}
