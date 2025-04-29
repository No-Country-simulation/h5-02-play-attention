'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';

/**
 * Componente de filtros para tickets de soporte
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo del filtrado
 */
export default function TicketFilters({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  dateFilter = 'all',
  onDateFilterChange = () => {}
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery || '');

  // Actualizar el término de búsqueda local cuando cambia el prop
  useEffect(() => {
    setLocalSearchTerm(searchQuery || '');
  }, [searchQuery]);

  // Aplicar filtro de búsqueda con un pequeño delay para no hacer muchas peticiones
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchQuery) {
        onSearchChange(localSearchTerm);
      }
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange, searchQuery]);

  // Estados disponibles para filtrar
  const statuses = [
    { value: 'all', label: 'Todos los tickets' },
    { value: 'abierto', label: 'Abiertos' },
    { value: 'en proceso', label: 'En proceso' },
    { value: 'resuelto', label: 'Resueltos' },
    { value: 'cerrado', label: 'Cerrados' }
  ];

  // Fechas para filtrar
  const dateFilters = [
    { value: 'all', label: 'Cualquier fecha' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Último trimestre' }
  ];

  // Manejar cambio en estado
  const handleStatusChange = e => {
    onStatusChange(e.target.value);
  };

  // Manejar cambio en filtro de fecha
  const handleDateFilterChange = e => {
    onDateFilterChange(e.target.value);
  };

  // Limpiar los filtros
  const handleClearFilters = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onStatusChange('all');
    onDateFilterChange('all');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    statusFilter !== 'all' ||
    dateFilter !== 'all' ||
    (searchQuery && searchQuery.trim() !== '');

  return (
    <div className='bg-gray-50 p-4 rounded-lg mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
        {/* Buscador */}
        <div className='relative col-span-1 md:col-span-6'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
          <input
            type='text'
            placeholder='Buscar por ID, asunto o usuario...'
            value={localSearchTerm}
            onChange={e => setLocalSearchTerm(e.target.value)}
            className='pl-10 pr-4 py-2 h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40'
          />
        </div>

        {/* Filtro por estado */}
        <div className='col-span-1 md:col-span-2'>
          <select
            className='w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary/40'
            value={statusFilter}
            onChange={handleStatusChange}
            aria-label='Filtrar por estado'
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por fecha */}
        <div className='col-span-1 md:col-span-2'>
          <select
            className='w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary/40'
            value={dateFilter}
            onChange={handleDateFilterChange}
            aria-label='Filtrar por fecha'
          >
            {dateFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón de limpiar filtros */}
        <div className='col-span-1 md:col-span-2'>
          {hasActiveFilters && (
            <Button
              type='button'
              variant='outline'
              onClick={handleClearFilters}
              className='h-10 w-full'
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
