'use client';

import { Search, Filter, Sliders } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Badge } from '@/shared/ui/badge';

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
  onDateFilterChange = () => {},
  priorityFilter = 'all',
  onPriorityChange = () => {},
  assigneeFilter = 'all',
  onAssigneeChange = () => {},
  departmentFilter = 'all',
  onDepartmentChange = () => {},
  typeFilter = 'all',
  onTypeChange = () => {}
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Actualizar el término de búsqueda local cuando cambia el prop
  useEffect(() => {
    setLocalSearchTerm(searchQuery || '');
  }, [searchQuery]);

  // Contar filtros activos
  useEffect(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (dateFilter !== 'all') count++;
    if (priorityFilter !== 'all') count++;
    if (assigneeFilter !== 'all') count++;
    if (departmentFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    setActiveFilterCount(count);
  }, [
    statusFilter,
    dateFilter,
    priorityFilter,
    assigneeFilter,
    departmentFilter,
    typeFilter
  ]);

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
    { value: 'yesterday', label: 'Ayer' },
    { value: 'week', label: 'Esta semana' },
    { value: 'last_week', label: 'Semana pasada' },
    { value: 'month', label: 'Este mes' },
    { value: 'last_month', label: 'Mes pasado' },
    { value: 'quarter', label: 'Último trimestre' },
    { value: 'custom', label: 'Personalizado' }
  ];

  // Prioridades para filtrar
  const priorities = [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' }
  ];

  // Asignados a
  const assignees = [
    { value: 'all', label: 'Todos los agentes' },
    { value: 'unassigned', label: 'Sin asignar' },
    { value: 'current_user', label: 'Asignados a mí' },
    { value: 'other', label: 'Otros agentes' }
  ];

  // Departamentos
  const departments = [
    { value: 'all', label: 'Todos los departamentos' },
    { value: 'soporte', label: 'Soporte técnico' },
    { value: 'ventas', label: 'Ventas' },
    { value: 'facturacion', label: 'Facturación' },
    { value: 'otro', label: 'Otro' }
  ];

  // Tipos de ticket
  const ticketTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'problema', label: 'Problema técnico' },
    { value: 'pregunta', label: 'Pregunta' },
    { value: 'solicitud', label: 'Solicitud de característica' },
    { value: 'incidente', label: 'Incidente' },
    { value: 'otro', label: 'Otro' }
  ];

  // Manejar cambio en estado
  const handleStatusChange = e => {
    onStatusChange(e.target.value);
  };

  // Manejar cambio en filtro de fecha
  const handleDateFilterChange = e => {
    onDateFilterChange(e.target.value);
  };

  // Manejar cambio en filtro de prioridad
  const handlePriorityChange = e => {
    onPriorityChange(e.target.value);
  };

  // Manejar cambio en filtro de asignado
  const handleAssigneeChange = e => {
    onAssigneeChange(e.target.value);
  };

  // Manejar cambio en filtro de departamento
  const handleDepartmentChange = e => {
    onDepartmentChange(e.target.value);
  };

  // Manejar cambio en filtro de tipo
  const handleTypeChange = e => {
    onTypeChange(e.target.value);
  };

  // Limpiar los filtros
  const handleClearFilters = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onStatusChange('all');
    onDateFilterChange('all');
    onPriorityChange('all');
    onAssigneeChange('all');
    onDepartmentChange('all');
    onTypeChange('all');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    statusFilter !== 'all' ||
    dateFilter !== 'all' ||
    priorityFilter !== 'all' ||
    assigneeFilter !== 'all' ||
    departmentFilter !== 'all' ||
    typeFilter !== 'all' ||
    (searchQuery && searchQuery.trim() !== '');

  return (
    <div className='bg-gray-50 p-4 rounded-lg mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-4 mb-4'>
        {/* Buscador */}
        <div className='relative col-span-1 md:col-span-5'>
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

        {/* Botón de filtros avanzados */}
        <div className='col-span-1 md:col-span-2'>
          <Popover
            open={showAdvancedFilters}
            onOpenChange={setShowAdvancedFilters}
          >
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full flex items-center justify-between h-10'
              >
                <span>Más filtros</span>
                {activeFilterCount > 0 && (
                  <Badge className='ml-2 bg-primary'>{activeFilterCount}</Badge>
                )}
                <Sliders className='w-4 h-4 ml-2' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium text-sm'>Prioridad</h4>
                  <select
                    className='w-full h-9 border border-gray-300 rounded-lg px-3 text-sm'
                    value={priorityFilter}
                    onChange={handlePriorityChange}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium text-sm'>Asignado a</h4>
                  <select
                    className='w-full h-9 border border-gray-300 rounded-lg px-3 text-sm'
                    value={assigneeFilter}
                    onChange={handleAssigneeChange}
                  >
                    {assignees.map(assignee => (
                      <option key={assignee.value} value={assignee.value}>
                        {assignee.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium text-sm'>Departamento</h4>
                  <select
                    className='w-full h-9 border border-gray-300 rounded-lg px-3 text-sm'
                    value={departmentFilter}
                    onChange={handleDepartmentChange}
                  >
                    {departments.map(dept => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium text-sm'>Tipo de ticket</h4>
                  <select
                    className='w-full h-9 border border-gray-300 rounded-lg px-3 text-sm'
                    value={typeFilter}
                    onChange={handleTypeChange}
                  >
                    {ticketTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Botón de limpiar filtros */}
        <div className='col-span-1 md:col-span-1'>
          {hasActiveFilters && (
            <Button
              type='button'
              variant='outline'
              onClick={handleClearFilters}
              className='h-10 w-full'
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2 mt-2'>
          {statusFilter !== 'all' && (
            <Badge variant='outline' className='px-2 py-1 text-xs gap-1'>
              Estado: {statuses.find(s => s.value === statusFilter)?.label}
              <button
                onClick={() => onStatusChange('all')}
                className='ml-1 hover:text-gray-900'
              >
                ×
              </button>
            </Badge>
          )}

          {dateFilter !== 'all' && (
            <Badge variant='outline' className='px-2 py-1 text-xs gap-1'>
              Fecha: {dateFilters.find(d => d.value === dateFilter)?.label}
              <button
                onClick={() => onDateFilterChange('all')}
                className='ml-1 hover:text-gray-900'
              >
                ×
              </button>
            </Badge>
          )}

          {priorityFilter !== 'all' && (
            <Badge variant='outline' className='px-2 py-1 text-xs gap-1'>
              Prioridad:{' '}
              {priorities.find(p => p.value === priorityFilter)?.label}
              <button
                onClick={() => onPriorityChange('all')}
                className='ml-1 hover:text-gray-900'
              >
                ×
              </button>
            </Badge>
          )}

          {assigneeFilter !== 'all' && (
            <Badge variant='outline' className='px-2 py-1 text-xs gap-1'>
              Asignado: {assignees.find(a => a.value === assigneeFilter)?.label}
              <button
                onClick={() => onAssigneeChange('all')}
                className='ml-1 hover:text-gray-900'
              >
                ×
              </button>
            </Badge>
          )}

          {departmentFilter !== 'all' && (
            <Badge variant='outline' className='px-2 py-1 text-xs gap-1'>
              Departamento:{' '}
              {departments.find(d => d.value === departmentFilter)?.label}
              <button
                onClick={() => onDepartmentChange('all')}
                className='ml-1 hover:text-gray-900'
              >
                ×
              </button>
            </Badge>
          )}

          {typeFilter !== 'all' && (
            <Badge variant='outline' className='px-2 py-1 text-xs gap-1'>
              Tipo: {ticketTypes.find(t => t.value === typeFilter)?.label}
              <button
                onClick={() => onTypeChange('all')}
                className='ml-1 hover:text-gray-900'
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
