'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Edit, Trash2, Tag, Plus } from 'lucide-react';
import DeleteConfirmationModal from '@/shared/ui/modals/DeleteConfirmationModal';
import {
  useCategories,
  useDeleteCategory
} from '../../lib/hooks/useCategories';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import CategoryForm from './CategoryForm';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

/**
 * Componente para gestionar las categorías de contenido
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de gestionar categorías
 */
export default function CategoriesList() {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener categorías desde la API
  const { data: categories = [], isLoading, error } = useCategories();
  const deleteMutation = useDeleteCategory();

  // Filtrar categorías por término de búsqueda
  const filteredCategories = categories.filter(
    category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para manejar la creación de nueva categoría
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  // Función para editar categoría existente
  const handleEditCategory = category => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Función para cancelar la creación/edición
  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedCategory(null);
  };

  // Función para manejar la intención de eliminar
  const handleDeleteClick = category => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(categoryToDelete.id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  // Función para manejar cambio en el término de búsqueda
  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  // Renderizado del formulario de creación/edición
  if (isCreating || isEditing) {
    return (
      <CategoryForm
        initialData={selectedCategory}
        onCancel={handleCancel}
        isEditing={isEditing}
      />
    );
  }

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <LoadingSpinner text='Cargando categorías' size={40} />
      </div>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className='text-center py-10 text-red-500'>
        Error al cargar categorías: {error.message}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-4'>
        <div>
          <CardTitle className='text-xl'>Categorías de Contenido</CardTitle>
          <CardDescription>
            Gestiona las categorías para organizar tu contenido
          </CardDescription>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className='h-4 w-4 mr-2' />
          Nueva Categoría
        </Button>
      </CardHeader>

      <CardContent>
        <div className='mb-4'>
          <Input
            placeholder='Buscar categorías...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='max-w-md'
          />
        </div>

        {/* Vista de tabla para pantallas grandes */}
        <div className='hidden lg:block border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Contenidos</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell className='font-medium'>
                      <div className='flex items-center'>
                        <Tag className='h-4 w-4 mr-2 text-gray-500' />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      {category.resourceCount || 0} contenido(s)
                    </TableCell>
                    <TableCell className='text-right space-x-2'>
                      <Button
                        onClick={() => handleEditCategory(category)}
                        variant='outline'
                        size='icon'
                        className='h-8 w-8'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(category)}
                        variant='outline'
                        size='icon'
                        className='h-8 w-8 text-gray-800 hover:bg-gray-100'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='text-center py-10 text-gray-500'
                  >
                    {searchTerm
                      ? 'No se encontraron categorías que coincidan con la búsqueda'
                      : 'No hay categorías disponibles. ¡Crea la primera!'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Vista de tarjetas para dispositivos móviles y tablets */}
        <div className='lg:hidden space-y-4'>
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <div
                key={category.id}
                className='bg-white p-4 rounded-lg border shadow-sm'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center mb-2'>
                    <Tag className='h-5 w-5 mr-2 text-purple-500' />
                    <h3 className='font-medium text-lg'>{category.name}</h3>
                  </div>

                  <div className='space-y-2 text-sm text-gray-600 mb-3'>
                    <div>
                      <span className='font-medium'>Descripción:</span>
                      <p className='mt-1'>
                        {category.description || 'Sin descripción'}
                      </p>
                    </div>
                    <div>
                      <span className='font-medium'>Contenidos asociados:</span>{' '}
                      {category.resourceCount || 0}
                    </div>
                  </div>
                </div>

                <div className='flex justify-end space-x-2 mt-2'>
                  <Button
                    onClick={() => handleEditCategory(category)}
                    variant='outline'
                    size='sm'
                    className='h-9'
                  >
                    <Edit className='h-4 w-4 mr-1' />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(category)}
                    variant='outline'
                    size='sm'
                    className='h-9 text-gray-800 hover:bg-gray-100'
                  >
                    <Trash2 className='h-4 w-4 mr-1' />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-10 bg-white rounded-lg border'>
              <p className='text-gray-500'>
                {searchTerm
                  ? 'No se encontraron categorías que coincidan con la búsqueda'
                  : 'No hay categorías disponibles. ¡Crea la primera!'}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title='Eliminar categoría'
        message={`¿Estás seguro que deseas eliminar la categoría "${categoryToDelete?.name}"? Esta acción podría afectar a los contenidos asociados.`}
      />
    </Card>
  );
}
