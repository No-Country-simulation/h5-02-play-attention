'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ContentList from './components/ContentList';
import ContentForm from './components/ContentForm';
import ContentFilters from './components/ContentFilters';
import ContentTypeSelector from './components/ContentTypeSelector';
import CategoriesList from './components/categories/CategoriesList';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Plus, FileText, Tag } from 'lucide-react';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';

/**
 * Componente principal para la gestión de contenido
 * Sigue el principio de Responsabilidad Única (SRP) y Abierto/Cerrado (OCP)
 * permitiendo extensiones futuras sin modificar el componente existente
 */
export default function ContentManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'content');

  const [isCreating, setIsCreating] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState('all');
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    category: 'Todos',
    status: 'Todos'
  });
  const { title, description } = getPageMetadata('content');

  // Función para cambiar de pestaña y actualizar la URL
  const handleTabChange = value => {
    setActiveTab(value);
    router.push(`/content?tab=${value}`, { scroll: false });
  };

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

  // Renderizado condicional para mostrar el contenido de la pestaña activa
  const renderContent = () => {
    if (activeTab === 'categories') {
      return <CategoriesList />;
    }

    // Pestaña de contenido
    if (isCreating) {
      return (
        <ContentForm initialData={selectedContent} onCancel={handleCancel} />
      );
    }

    // Listado de contenido
    return (
      <>
        <div className='flex flex-col gap-4 mb-6'>
          <div className='w-full'>
            <ContentTypeSelector
              selectedType={contentType}
              onTypeChange={setContentType}
            />
          </div>

          <div className='w-full flex justify-end'>
            <Button onClick={handleCreateContent} className='w-full lg:w-auto'>
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Contenido
            </Button>
          </div>
        </div>

        <ContentFilters onFiltersChange={handleFiltersChange} />

        <ContentList
          contentType={contentType}
          searchFilters={searchFilters}
          onEdit={handleEditContent}
        />
      </>
    );
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {!isCreating && <PageHeader title={title} description={description} />}

      <Tabs
        defaultValue='content'
        value={activeTab}
        onValueChange={handleTabChange}
        className='mb-6'
      >
        <div className='w-full overflow-x-auto pb-2 no-scrollbar'>
          <TabsList className='w-full sm:w-auto justify-start sm:justify-center'>
            <TabsTrigger
              value='content'
              className='flex items-center whitespace-nowrap'
            >
              <FileText className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Gestión de Contenido</span>
              <span className='sm:hidden'>Contenido</span>
            </TabsTrigger>
            <TabsTrigger
              value='categories'
              className='flex items-center whitespace-nowrap'
            >
              <Tag className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Gestión de Categorías</span>
              <span className='sm:hidden'>Categorías</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='content' className='mt-4'>
          {activeTab === 'content' && renderContent()}
        </TabsContent>

        <TabsContent value='categories' className='mt-4'>
          {activeTab === 'categories' && renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
