'use client';

import { useState } from 'react';
import { CalendarIcon, FilterX } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/badge';

/**
 * Componente para filtrar notificaciones
 * Sigue el principio de responsabilidad única (SRP) al encargarse solo de la funcionalidad de filtrado
 */
export default function NotificationFilters({ activeFilters, onFilterChange }) {
  const [date, setDate] = useState({
    from: activeFilters.dateRange?.from,
    to: activeFilters.dateRange?.to
  });

  // Calcular cuántos filtros están activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.type !== 'all') count++;
    if (activeFilters.status !== 'all') count++;
    if (activeFilters.dateRange) count++;
    return count;
  };

  // Aplicar filtro de fecha
  const handleDateSelect = selectedDate => {
    setDate(selectedDate);

    // Solo aplicar el filtro si hay un rango completo
    if (selectedDate.from && selectedDate.to) {
      onFilterChange({ dateRange: selectedDate });
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setDate({ from: undefined, to: undefined });
    onFilterChange({
      type: 'all',
      status: 'all',
      dateRange: null
    });
  };

  // Formatear la fecha para mostrar
  const formatDateRange = () => {
    if (!activeFilters.dateRange?.from || !activeFilters.dateRange?.to) {
      return 'Seleccionar rango';
    }

    return `${format(activeFilters.dateRange.from, 'PP', {
      locale: es
    })} - ${format(activeFilters.dateRange.to, 'PP', { locale: es })}`;
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-lg font-semibold'>Filtros</CardTitle>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant='ghost'
            size='sm'
            className='h-8 gap-1'
            onClick={clearAllFilters}
          >
            <FilterX className='h-4 w-4' />
            <span>Limpiar filtros</span>
            <Badge variant='secondary' className='ml-1'>
              {getActiveFiltersCount()}
            </Badge>
          </Button>
        )}
      </CardHeader>
      <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='type-filter'>Tipo de notificación</Label>
          <Select
            id='type-filter'
            value={activeFilters.type}
            onValueChange={value => onFilterChange({ type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar tipo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos los tipos</SelectItem>
              <SelectItem value='ticket'>Tickets</SelectItem>
              <SelectItem value='user'>Usuarios</SelectItem>
              <SelectItem value='lead'>Leads</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='status-filter'>Estado</Label>
          <Select
            id='status-filter'
            value={activeFilters.status}
            onValueChange={value => onFilterChange({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar estado' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos los estados</SelectItem>
              <SelectItem value='read'>Leídas</SelectItem>
              <SelectItem value='unread'>No leídas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>Rango de fechas</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start text-left font-normal h-9'
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={date.from}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
