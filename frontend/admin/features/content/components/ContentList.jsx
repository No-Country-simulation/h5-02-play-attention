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
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import DeleteConfirmationModal from '@/shared/ui/modals/DeleteConfirmationModal';

// Datos de ejemplo para la demostración
const MOCK_CONTENT = [
  {
    id: 1,
    title: 'Guía de concentración',
    type: 'Artículo',
    category: 'Tutoriales',
    date: '2023-10-15',
    status: 'Publicado'
  },
  {
    id: 2,
    title: 'Técnicas de meditación',
    type: 'Video',
    category: 'Educativo',
    date: '2023-11-01',
    status: 'Publicado'
  },
  {
    id: 3,
    title: 'Presentación mindfulness',
    type: 'Presentación',
    category: 'Educativo',
    date: '2023-11-10',
    status: 'Borrador'
  },
  {
    id: 4,
    title: 'Guía TDAH para padres',
    type: 'PDF',
    category: 'Médico',
    date: '2023-09-20',
    status: 'Publicado'
  },
  {
    id: 5,
    title: 'Ejercicios de atención',
    type: 'Artículo',
    category: 'Tutoriales',
    date: '2023-10-05',
    status: 'Borrador'
  }
];

/**
 * Componente para listar contenido con opciones CRUD
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de mostrar y gestionar la lista
 */
export default function ContentList({ contentType, searchFilters, onEdit }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  // Función para filtrar contenido con todos los criterios
  const filteredContent = MOCK_CONTENT.filter(item => {
    // Filtrar por tipo de contenido (selector superior)
    if (contentType !== 'all' && item.type.toLowerCase() !== contentType) {
      return false;
    }

    // Filtrar por término de búsqueda (busca en todos los campos)
    if (searchFilters.searchTerm) {
      const searchTermLower = searchFilters.searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchTermLower) ||
        item.type.toLowerCase().includes(searchTermLower) ||
        item.category.toLowerCase().includes(searchTermLower) ||
        item.status.toLowerCase().includes(searchTermLower);

      if (!matchesSearch) {
        return false;
      }
    }

    // Filtrar por categoría
    if (
      searchFilters.category !== 'Todos' &&
      item.category !== searchFilters.category
    ) {
      return false;
    }

    // Filtrar por estado
    if (
      searchFilters.status !== 'Todos' &&
      item.status !== searchFilters.status
    ) {
      return false;
    }

    return true;
  });

  // Función para manejar la intención de eliminar
  const handleDeleteClick = content => {
    setContentToDelete(content);
    setDeleteModalOpen(true);
  };

  // Función para confirmar eliminación
  const confirmDelete = () => {
    // Lógica para eliminar el contenido
    console.log('Eliminando contenido:', contentToDelete);
    setDeleteModalOpen(false);
    setContentToDelete(null);
  };

  return (
    <div className='mt-4 border rounded-lg overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className='text-right'>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContent.length > 0 ? (
            filteredContent.map(content => (
              <TableRow key={content.id}>
                <TableCell className='font-medium'>{content.title}</TableCell>
                <TableCell>{content.type}</TableCell>
                <TableCell>{content.category}</TableCell>
                <TableCell>{content.date}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      content.status === 'Publicado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {content.status}
                  </span>
                </TableCell>
                <TableCell className='text-right space-x-2'>
                  <Button
                    onClick={() => onEdit(content)}
                    variant='outline'
                    size='icon'
                    className='h-8 w-8'
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(content)}
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
                colSpan={6}
                className='text-center py-10 text-gray-500'
              >
                No se encontró contenido para mostrar
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title='Eliminar contenido'
        message={`¿Estás seguro que deseas eliminar "${contentToDelete?.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
