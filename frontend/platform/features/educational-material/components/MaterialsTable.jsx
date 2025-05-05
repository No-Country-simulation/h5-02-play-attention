'use client';

import React from 'react';
import { MaterialCard } from './MaterialCard';

/**
 * Table component to display the list of educational materials
 */
export function MaterialsTable({ materials, onDownload }) {
  return (
    <div className='shadow-sm rounded-lg overflow-hidden border border-gray-200'>
      <table className='min-w-full bg-white'>
        <thead className='bg-gray-50 border-b border-gray-200'>
          <tr>
            <th
              scope='col'
              className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Título
            </th>
            <th
              scope='col'
              className='py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Tipo
            </th>
            <th
              scope='col'
              className='py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Fecha
            </th>
            <th
              scope='col'
              className='py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Tamaño
            </th>
            <th
              scope='col'
              className='py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 ? (
            materials.map(material => (
              <MaterialCard
                key={material.id}
                material={material}
                onDownload={onDownload}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No hay materiales educativos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
