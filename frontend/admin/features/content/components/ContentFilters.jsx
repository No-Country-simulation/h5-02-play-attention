'use client';

import { Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { useCategories } from '../lib/hooks';

/**
 * Componente de filtros para la búsqueda y filtrado de contenido
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo del filtrado
 */
export default function ContentFilters({ onFiltersChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const categoryRef = useRef(null);
  const statusRef = useRef(null);

  // Obtener categorías desde la API
  const { data: categoriesData = [], isLoading: loadingCategories } =
    useCategories();

  // Preparar categorías para el dropdown
  const categories = [
    'Todos',
    ...categoriesData.map(category => category.name)
  ];

  // Estados disponibles para filtrar
  const statuses = ['Todos', 'Publicado', 'Borrador'];

  // Cerrar los dropdowns cuando se hace clic fuera de ellos
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Notificar cambios en los filtros al componente padre
  useEffect(() => {
    onFiltersChange({
      searchTerm,
      category: selectedCategory,
      status: selectedStatus
    });
  }, [searchTerm, selectedCategory, selectedStatus, onFiltersChange]);

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category);
    setCategoryOpen(false);
  };

  const handleStatusChange = status => {
    setSelectedStatus(status);
    setStatusOpen(false);
  };

  return (
    <div className='bg-gray-50 p-4 rounded-lg mb-6'>
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Buscador */}
        <div className='relative flex-grow mb-3 lg:mb-0'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
          <input
            type='text'
            placeholder='Buscar contenido...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='pl-10 pr-4 py-3 h-12 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 hover:border-purple-300'
            style={{ color: '#333' }}
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
          {/* Filtro por categoría personalizado */}
          <div
            className='w-full sm:w-1/2 lg:w-48 mb-3 sm:mb-0'
            ref={categoryRef}
          >
            <div className='relative'>
              <div
                className='w-full h-12 border border-gray-300 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:border-purple-300 bg-white'
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-500'>Categoría</span>
                  <span className='truncate max-w-[120px]'>
                    {selectedCategory}
                  </span>
                </div>
                <ChevronDown className='h-4 w-4 text-gray-500 ml-2 flex-shrink-0' />
              </div>

              {categoryOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                  {loadingCategories ? (
                    <div className='px-3 py-3 text-center text-gray-500'>
                      Cargando categorías...
                    </div>
                  ) : (
                    categories.map(category => (
                      <div
                        key={category}
                        className={`px-3 py-3 cursor-pointer hover:bg-purple-100 ${
                          selectedCategory === category
                            ? 'bg-purple-100 text-purple-800'
                            : ''
                        }`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Filtro por estado personalizado */}
          <div className='w-full sm:w-1/2 lg:w-48' ref={statusRef}>
            <div className='relative'>
              <div
                className='w-full h-12 border border-gray-300 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:border-purple-300 bg-white'
                onClick={() => setStatusOpen(!statusOpen)}
              >
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-500'>Estado</span>
                  <span>{selectedStatus}</span>
                </div>
                <ChevronDown className='h-4 w-4 text-gray-500 ml-2 flex-shrink-0' />
              </div>

              {statusOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg'>
                  {statuses.map(status => (
                    <div
                      key={status}
                      className={`px-3 py-3 cursor-pointer hover:bg-purple-100 ${
                        selectedStatus === status
                          ? 'bg-purple-100 text-purple-800'
                          : ''
                      }`}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
