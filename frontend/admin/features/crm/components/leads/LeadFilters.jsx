'use client';

import { Search, Plus, ArrowDown10, ArrowUp10, SortAsc } from 'lucide-react';
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
  onCreateLead,
  sortOrder = 'recent',
  onSortChange
}) {
  return (
    <div className='bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6'>
      {/* Versión desktop - visible solo en pantallas grandes */}
      <div className='hidden lg:flex lg:flex-col lg:gap-3'>
        <div className='grid grid-cols-12 gap-4'>
          {/* Buscador */}
          <div className='col-span-4'>
            <Label htmlFor='searchTerm-desktop' className='mb-2 block text-sm'>
              Buscar leads
            </Label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
              <Input
                id='searchTerm-desktop'
                type='text'
                placeholder='Buscar por nombre, email, empresa...'
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className='pl-10 h-10 text-sm'
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className='col-span-2'>
            <Label
              htmlFor='statusFilter-desktop'
              className='mb-2 block text-sm'
            >
              Estado
            </Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger id='statusFilter-desktop' className='h-10 text-sm'>
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
          <div className='col-span-2'>
            <Label
              htmlFor='userTypeFilter-desktop'
              className='mb-2 block text-sm'
            >
              Tipo de usuario
            </Label>
            <Select value={userTypeFilter} onValueChange={onUserTypeChange}>
              <SelectTrigger
                id='userTypeFilter-desktop'
                className='h-10 text-sm'
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

          {/* Filtro de ordenamiento */}
          <div className='col-span-2'>
            <Label htmlFor='sortOrder-desktop' className='mb-2 block text-sm'>
              Ordenar por
            </Label>
            <Select value={sortOrder} onValueChange={onSortChange}>
              <SelectTrigger id='sortOrder-desktop' className='h-10 text-sm'>
                <SelectValue placeholder='Ordenar' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='recent'>
                  <div className='flex items-center'>
                    <ArrowDown10 className='h-4 w-4 mr-2' />
                    <span>Más recientes</span>
                  </div>
                </SelectItem>
                <SelectItem value='oldest'>
                  <div className='flex items-center'>
                    <ArrowUp10 className='h-4 w-4 mr-2' />
                    <span>Más antiguos</span>
                  </div>
                </SelectItem>
                <SelectItem value='alphabetical'>
                  <div className='flex items-center'>
                    <SortAsc className='h-4 w-4 mr-2' />
                    <span>Alfabético</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón de nuevo lead */}
          <div className='col-span-2 flex items-end justify-end'>
            <Button
              onClick={onCreateLead}
              className='w-auto px-4 h-10 cursor-pointer'
              variant='purple'
            >
              <Plus className='mr-2 h-4 w-4' />
              <span className='whitespace-nowrap'>Nuevo Lead</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Versión mobile y tablet - visible en pantallas pequeñas y medianas */}
      <div className='lg:hidden space-y-4'>
        {/* Buscador */}
        <div>
          <Label
            htmlFor='searchTerm-mobile'
            className='mb-1 sm:mb-2 block text-sm'
          >
            Buscar leads
          </Label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5' />
            <Input
              id='searchTerm-mobile'
              type='text'
              placeholder='Buscar por nombre, email, empresa...'
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className='pl-10 h-9 sm:h-10 text-sm'
            />
          </div>
        </div>

        {/* Filtros y botón */}
        <div className='grid grid-cols-2 gap-3'>
          {/* Filtro por estado */}
          <div>
            <Label
              htmlFor='statusFilter-mobile'
              className='mb-1 sm:mb-2 block text-sm'
            >
              Estado
            </Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger
                id='statusFilter-mobile'
                className='h-9 sm:h-10 text-sm'
              >
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
          <div>
            <Label
              htmlFor='userTypeFilter-mobile'
              className='mb-1 sm:mb-2 block text-sm'
            >
              Tipo
            </Label>
            <Select value={userTypeFilter} onValueChange={onUserTypeChange}>
              <SelectTrigger
                id='userTypeFilter-mobile'
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

          {/* Filtro de ordenamiento en móvil */}
          <div>
            <Label
              htmlFor='sortOrder-mobile'
              className='mb-1 sm:mb-2 block text-sm'
            >
              Orden
            </Label>
            <Select value={sortOrder} onValueChange={onSortChange}>
              <SelectTrigger
                id='sortOrder-mobile'
                className='h-9 sm:h-10 text-sm'
              >
                <SelectValue placeholder='Ordenar' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='recent'>
                  <div className='flex items-center'>
                    <ArrowDown10 className='h-4 w-4 mr-2' />
                    <span>Más recientes</span>
                  </div>
                </SelectItem>
                <SelectItem value='oldest'>
                  <div className='flex items-center'>
                    <ArrowUp10 className='h-4 w-4 mr-2' />
                    <span>Más antiguos</span>
                  </div>
                </SelectItem>
                <SelectItem value='alphabetical'>
                  <div className='flex items-center'>
                    <SortAsc className='h-4 w-4 mr-2' />
                    <span>Alfabético</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón de nuevo lead */}
          <div className='col-span-2'>
            <Button
              onClick={onCreateLead}
              className='w-full h-9 sm:h-10 cursor-pointer'
              variant='purple'
            >
              <Plus className='mr-2 h-4 w-4' />
              <span className='whitespace-nowrap'>Nuevo Lead</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
