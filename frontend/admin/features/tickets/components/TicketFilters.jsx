'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente de filtros para tickets de soporte
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo del filtrado
 */
export default function TicketFilters({ statusFilter, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Estados disponibles para filtrar
  const statuses = [
    { value: 'all', label: 'Todos los tickets' },
    { value: 'abierto', label: 'Abiertos' },
    { value: 'en proceso', label: 'En proceso' },
    { value: 'resuelto', label: 'Resueltos' }
  ];

  // Fechas para filtrar
  const dateFilters = [
    { value: 'all', label: 'Cualquier fecha' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' }
  ];

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí iría la lógica para aplicar los filtros
    console.log('Buscando:', searchTerm);
  };

  return (
    <div className='bg-gray-50 p-4 rounded-lg mb-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Buscador */}
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
            <input
              type='text'
              placeholder='Buscar por ID, asunto o usuario...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ff9940]'
            />
          </div>

          {/* Filtro por estado */}
          <div className='w-full md:w-48'>
            <select
              className='w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#00ff9940]'
              value={statusFilter}
              onChange={e => onStatusChange(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por fecha */}
          <div className='w-full md:w-48'>
            <select
              className='w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#00ff9940]'
              defaultValue='all'
            >
              {dateFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de búsqueda */}
          <button
            type='submit'
            className='h-10 px-6 bg-[#1c1c22] text-white rounded-lg hover:bg-[#2a2a32] transition-colors'
          >
            Filtrar
          </button>
        </div>
      </form>
    </div>
  );
}
 