'use client';

import { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import DeleteConfirmationModal from '@/shared/ui/modals/DeleteConfirmationModal';
import { useContents, useDeleteContent } from '../lib/hooks';

/**
 * Genera un nombre de archivo significativo basado en el tipo y título del contenido
 * @param {Object} content - El contenido a descargar
 * @returns {string} - Nombre del archivo con extensión
 */
function getFileName(content) {
  // Limpiar el título para un nombre de archivo válido
  const title = content.title.replace(/\s+/g, '_').replace(/[^\w-]/g, '');

  // Detectar el tipo de archivo de forma más precisa
  let extension = '';

  // 1. Primero intentar detectar por el tipo de contenido en minúsculas
  const type = content.type ? content.type.toLowerCase() : '';

  if (type === 'pdf') {
    extension = '.pdf';
  } else if (type === 'video') {
    extension = '.mp4';
  } else if (type === 'artículo' || type === 'articulo') {
    extension = '.html';
  } else if (type === 'imagen' || type === 'image') {
    extension = '.jpg';
  } else if (type === 'audio') {
    extension = '.mp3';
  } else if (type === 'presentación' || type === 'presentacion') {
    extension = '.pptx';
  } else {
    // 2. Si no podemos determinar por el tipo, intentar detectar por la URL
    const url = content.fileUrl || content.url || '';

    console.log('Detectando tipo por URL:', url);

    if (url.includes('.pdf') || url.includes('/pdf/')) {
      extension = '.pdf';
    } else if (url.includes('.mp4') || url.includes('/video/')) {
      extension = '.mp4';
    } else if (
      url.includes('.jpg') ||
      url.includes('.jpeg') ||
      url.includes('/image/')
    ) {
      extension = '.jpg';
    } else if (url.includes('.png')) {
      extension = '.png';
    } else if (url.includes('.mp3') || url.includes('/audio/')) {
      extension = '.mp3';
    } else if (url.includes('.ppt') || url.includes('.pptx')) {
      extension = '.pptx';
    } else if (url.includes('.doc') || url.includes('.docx')) {
      extension = '.docx';
    } else {
      // 3. Si todo falla, usar .txt como predeterminado
      extension = '.txt';
    }
  }

  console.log(`Asignando nombre: ${title}${extension} para tipo: ${type}`);

  return `${title}${extension}`;
}

/**
 * Maneja la descarga de archivos con el nombre y extensión correctos
 * @param {Object} content - El contenido a descargar
 * @returns {Function} - Función controladora de eventos
 */
function handleDownload(content) {
  return async e => {
    e.preventDefault();

    if (!content.fileUrl && !content.url) return;

    const url = content.fileUrl || content.url;
    const fileName = getFileName(content);

    try {
      // Mostrar indicador de carga
      const button = e.currentTarget;
      const originalText = button.innerText;
      button.innerText = 'Descargando...';

      // Realizar fetch para obtener el archivo como blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Crear un objeto URL para el blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Crear un enlace temporal
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;

      // Añadir al DOM, hacer clic y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar el objeto URL
      window.URL.revokeObjectURL(blobUrl);

      // Restaurar el texto del botón
      button.innerText = originalText;
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      alert(
        'Hubo un error al descargar el archivo. Por favor, intenta nuevamente.'
      );
    }
  };
}

/**
 * Componente para listar contenido con opciones CRUD
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de mostrar y gestionar la lista
 */
export default function ContentList({ contentType, searchFilters, onEdit }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  // Obtener contenidos desde la API
  const { data: contents = [], isLoading, error } = useContents();

  // Debug: imprimir contenidos para diagnóstico
  console.log('Contenidos recibidos en componente:', contents);

  const deleteMutation = useDeleteContent();

  // Función para filtrar contenido con todos los criterios
  const filteredContent = contents.filter(item => {
    // Filtrar por tipo de contenido (selector superior)
    if (
      contentType !== 'all' &&
      item.type.toLowerCase() !== contentType.toLowerCase()
    ) {
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
  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(contentToDelete.id);
      setDeleteModalOpen(false);
      setContentToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Mostrar estado de carga
  if (isLoading) {
    return <div className='text-center py-10'>Cargando contenidos...</div>;
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className='text-center py-10 text-red-500'>
        Error al cargar contenidos: {error.message}
      </div>
    );
  }

  return (
    <div className='mt-4'>
      {/* Vista de tabla para pantallas medianas y grandes */}
      <div className='hidden md:block border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descargar</TableHead>
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
                  <TableCell>
                    {content.fileUrl || content.url ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleDownload(content)}
                        className='inline-flex items-center'
                      >
                        <Download className='h-4 w-4 mr-1' />
                        Descargar
                      </Button>
                    ) : (
                      <span className='text-gray-400 text-sm'>
                        No disponible
                      </span>
                    )}
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
                  colSpan={7}
                  className='text-center py-10 text-gray-500'
                >
                  No se encontró contenido para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vista de tarjetas para dispositivos móviles */}
      <div className='md:hidden space-y-4'>
        {filteredContent.length > 0 ? (
          filteredContent.map(content => (
            <div
              key={content.id}
              className='bg-white p-4 rounded-lg border shadow-sm'
            >
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-medium text-lg'>{content.title}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    content.status === 'Publicado'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {content.status}
                </span>
              </div>

              <div className='grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-3'>
                <div>
                  <span className='font-medium'>Tipo:</span> {content.type}
                </div>
                <div>
                  <span className='font-medium'>Categoría:</span>{' '}
                  {content.category}
                </div>
                <div>
                  <span className='font-medium'>Fecha:</span> {content.date}
                </div>
                <div>
                  <span className='font-medium'>Archivo:</span>{' '}
                  {content.fileUrl || content.url ? (
                    <button
                      onClick={handleDownload(content)}
                      className='text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer'
                    >
                      Descargar
                    </button>
                  ) : (
                    <span className='text-gray-400'>No disponible</span>
                  )}
                </div>
              </div>

              <div className='flex justify-end space-x-2 mt-2'>
                <Button
                  onClick={() => onEdit(content)}
                  variant='outline'
                  size='sm'
                  className='h-9'
                >
                  <Edit className='h-4 w-4 mr-1' />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeleteClick(content)}
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
              No se encontró contenido para mostrar
            </p>
          </div>
        )}
      </div>

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
