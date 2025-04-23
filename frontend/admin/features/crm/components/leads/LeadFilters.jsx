'use client';

import { Search, Plus } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import {
  leadStatusConfig,
  leadUserTypeConfig,
  leadStatusOptions,
  leadUserTypeOptions
} from '../../lib/config/ui-config';

/**
 * Componente de filtros para leads
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo del filtrado
 */
export default function LeadFilters({
  statusFilter,
  userTypeFilter,
  onStatusChange,
  onUserTypeChange,
  searchTerm,
  onSearchChange,
  onCreateLead
}) {
  return (
    <div className='bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6'>
      <div className='flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4'>
        {/* Buscador */}
        <div className='sm:col-span-12 md:col-span-6'>
          <Label htmlFor='searchTerm' className='mb-1 sm:mb-2 block text-sm'>
            Buscar leads
          </Label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5' />
            <Input
              id='searchTerm'
              type='text'
              placeholder='Buscar por nombre, email, empresa...'
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className='pl-10 h-9 sm:h-10 text-sm'
            />
          </div>
        </div>

        <div className='flex gap-3 sm:contents'>
          {/* Filtro por estado */}
          <div className='flex-1 sm:flex-none sm:col-span-3 md:col-span-2'>
            <Label
              htmlFor='statusFilter'
              className='mb-1 sm:mb-2 block text-sm'
            >
              Estado
            </Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger id='statusFilter' className='h-9 sm:h-10 text-sm'>
                <SelectValue placeholder='Estado' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos los estados</SelectItem>
                {leadStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {leadStatusConfig[status]?.label || status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por tipo de usuario */}
          <div className='flex-1 sm:flex-none sm:col-span-3 md:col-span-2'>
            <Label
              htmlFor='userTypeFilter'
              className='mb-1 sm:mb-2 block text-sm'
            >
              Tipo de usuario
            </Label>
            <Select value={userTypeFilter} onValueChange={onUserTypeChange}>
              <SelectTrigger
                id='userTypeFilter'
                className='h-9 sm:h-10 text-sm'
              >
                <SelectValue placeholder='Tipo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos los tipos</SelectItem>
                {leadUserTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>
                    {leadUserTypeConfig[type]?.label || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botón de nuevo lead */}
        <div className='sm:col-span-6 md:col-span-2 flex items-end justify-center sm:justify-end mt-2 sm:mt-0'>
          <Button
            onClick={onCreateLead}
            className='w-full sm:w-auto px-4 h-9 sm:h-10'
            variant='purple'
          >
            <Plus className='mr-2 h-4 w-4' />
            <span className='whitespace-nowrap'>Nuevo Lead</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
