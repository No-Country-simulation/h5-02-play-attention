'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { Search, X } from 'lucide-react';

/**
 * Componente para gestionar los filtros de usuarios
 * Este es un componente placeholder para una futura implementación
 * Actualmente la funcionalidad está integrada directamente en UserManagement
 */
export function UserFilters({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    status: initialFilters.status || '',
    role: initialFilters.role || ''
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: '',
      role: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              name='search'
              placeholder='Buscar por nombre o email'
              className='pl-8'
              value={filters.search}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 sm:w-auto sm:grid-cols-3'>
          <div className='space-y-2'>
            <Label htmlFor='status'>Estado</Label>
            <Select
              value={filters.status}
              onValueChange={value => handleSelectChange('status', value)}
            >
              <SelectTrigger id='status'>
                <SelectValue placeholder='Todos' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>Todos</SelectItem>
                <SelectItem value='active'>Activos</SelectItem>
                <SelectItem value='inactive'>Inactivos</SelectItem>
                <SelectItem value='banned'>Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Rol</Label>
            <Select
              value={filters.role}
              onValueChange={value => handleSelectChange('role', value)}
            >
              <SelectTrigger id='role'>
                <SelectValue placeholder='Todos' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>Todos</SelectItem>
                <SelectItem value='admin'>Administrador</SelectItem>
                <SelectItem value='teacher'>Profesor</SelectItem>
                <SelectItem value='student'>Estudiante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-end space-x-2 col-span-2 sm:col-span-1'>
            <Button variant='outline' onClick={handleSearch} className='flex-1'>
              Filtrar
            </Button>
            {(filters.search || filters.status || filters.role) && (
              <Button
                variant='ghost'
                size='icon'
                onClick={handleReset}
                title='Limpiar filtros'
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
