'use client';

import { useState, useCallback } from 'react';
import ContentList from './components/ContentList';
import ContentForm from './components/ContentForm';
import ContentFilters from './components/ContentFilters';
import ContentTypeSelector from './components/ContentTypeSelector';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';

/**
 * Componente principal para la gestión de contenido
 * Sigue el principio de Responsabilidad Única (SRP) y Abierto/Cerrado (OCP)
 * permitiendo extensiones futuras sin modificar el componente existente
 */
export default function ContentManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState('all');
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    category: 'Todos',
    status: 'Todos'
  });
  const { title, description } = getPageMetadata('content');

  // Función para manejar la creación de nuevo contenido
  const handleCreateContent = () => {
    setSelectedContent(null);
    setIsCreating(true);
  };

  // Función para editar contenido existente
  const handleEditContent = content => {
    setSelectedContent(content);
    setIsCreating(true);
  };

  // Función para cancelar la creación/edición
  const handleCancel = () => {
    setIsCreating(false);
    setSelectedContent(null);
  };

  // Función para actualizar los filtros de búsqueda
  const handleFiltersChange = useCallback(newFilters => {
    setSearchFilters(newFilters);
  }, []);

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {!isCreating && <PageHeader title={title} description={description} />}

      {isCreating ? (
        <ContentForm initialData={selectedContent} onCancel={handleCancel} />
      ) : (
        <>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
            <ContentTypeSelector
              selectedType={contentType}
              onTypeChange={setContentType}
            />

            <Button onClick={handleCreateContent}>
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Contenido
            </Button>
          </div>

          <ContentFilters onFiltersChange={handleFiltersChange} />

          <ContentList
            contentType={contentType}
            searchFilters={searchFilters}
            onEdit={handleEditContent}
          />
        </>
      )}
    </div>
  );
}
