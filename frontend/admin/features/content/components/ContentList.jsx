'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import {
  Edit,
  Trash2,
  Download,
  FileText,
  Video,
  Image,
  File,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { Button } from '@/shared/ui/button';
import DeleteConfirmationModal from '@/shared/ui/modals/DeleteConfirmationModal';
import { useContents, useDeleteContent, useCategories } from '../lib/hooks';
import ContentPagination from './ContentPagination';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

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
 * Modal para previsualizar contenido
 */
function PreviewModal({ content, isOpen, onClose }) {
  if (!isOpen) return null;

  const type = content?.type ? content.type.toLowerCase() : '';
  const url = content?.url || content?.fileUrl || '';

  const renderPreview = () => {
    if (!url)
      return (
        <p className='text-center text-gray-500'>
          No hay contenido disponible para previsualizar
        </p>
      );

    if (type === 'imagen' || type === 'image') {
      return (
        <div className='flex justify-center'>
          <img
            src={url}
            alt={content.title}
            className='max-h-[70vh] max-w-full object-contain'
          />
        </div>
      );
    } else if (type === 'video') {
      if (content.youtubeId) {
        return (
          <div className='w-full max-w-xl mx-auto'>
            <div className='relative pb-[56.25%] h-0'>
              <iframe
                src={`https://www.youtube.com/embed/${content.youtubeId}?autoplay=1`}
                title={content.title}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                className='absolute top-0 left-0 w-full h-full rounded-lg'
              ></iframe>
            </div>
          </div>
        );
      } else if (url) {
        return (
          <div className='w-full max-w-xl mx-auto'>
            <div className='relative pb-[56.25%] h-0'>
              <video
                controls
                autoPlay
                preload='auto'
                className='absolute top-0 left-0 w-full h-full rounded-lg'
              >
                <source src={url} type='video/mp4' />
                <source src={url} type='video/webm' />
                <source src={url} type='video/ogg' />
                Tu navegador no soporta videos.
              </video>
            </div>
          </div>
        );
      }
    } else if (type === 'pdf') {
      // Solución: No mostrar vista previa para PDFs
      return (
        <div className='text-center py-6'>
          <FileText className='w-16 h-16 text-red-500 mx-auto mb-3' />
          <p className='mb-4'>
            La vista previa de PDF no está disponible en este momento.
          </p>

          <Button variant='outline' size='sm' onClick={handleDownload(content)}>
            <Download className='h-4 w-4 mr-1' />
            Descargar PDF
          </Button>
        </div>
      );
    } else {
      return (
        <div className='text-center py-6'>
          <File className='w-16 h-16 text-gray-400 mx-auto mb-3' />
          <p>Este tipo de contenido no se puede previsualizar</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-3'
            onClick={handleDownload(content)}
          >
            <Download className='h-4 w-4 mr-1' />
            Descargar archivo
          </Button>
        </div>
      );
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col'
        onClick={e => e.stopPropagation()}
      >
        <div className='p-4 border-b flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>{content.title}</h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='h-8 w-8'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        <div className='flex-1 overflow-auto p-4'>{renderPreview()}</div>

        <div className='p-4 border-t flex justify-between'>
          <div>
            <span className='text-sm text-gray-500'>
              {content.type} •{' '}
              {typeof content.category === 'object'
                ? content.category.name
                : content.category}
            </span>
          </div>
          <Button variant='outline' size='sm' onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para mostrar miniatura según el tipo de contenido
 */
function ContentThumbnail({ content, onClick }) {
  const type = content.type ? content.type.toLowerCase() : '';
  const fileUrl = content.fileUrl || content.url || '';

  // Estilo base para miniaturas
  const imgClassName = 'w-16 h-16 object-cover rounded border';
  const wrapperClass =
    'flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity';
  const staticWrapperClass = 'flex items-center justify-center';

  const handleClick = () => {
    // No permitir vista previa para PDFs
    if (type === 'pdf') return;

    if (onClick) onClick(content);
  };

  if ((type === 'imagen' || type === 'image') && fileUrl) {
    return (
      <div className={wrapperClass} onClick={handleClick}>
        <img src={fileUrl} alt={content.title} className={imgClassName} />
      </div>
    );
  } else if (type === 'video') {
    if (content.youtubeId) {
      return (
        <div className={wrapperClass} onClick={handleClick}>
          <div className='relative'>
            <img
              src={`https://img.youtube.com/vi/${content.youtubeId}/default.jpg`}
              alt={content.title}
              className={imgClassName}
            />
            <div className='absolute bottom-1 right-1 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center'>
              <FaYoutube color='white' size={12} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={`${wrapperClass} bg-gray-100 p-2 rounded`}
        onClick={handleClick}
      >
        <Video className='w-8 h-8 text-blue-500' />
      </div>
    );
  } else if (type === 'pdf') {
    return (
      <div className={`${staticWrapperClass} bg-gray-100 p-2 rounded`}>
        <FileText className='w-8 h-8 text-red-500' />
      </div>
    );
  } else {
    return (
      <div
        className={`${wrapperClass} bg-gray-100 p-2 rounded`}
        onClick={handleClick}
      >
        <File className='w-8 h-8 text-gray-500' />
      </div>
    );
  }
}

/**
 * Componente para listar contenido con opciones CRUD
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de mostrar y gestionar la lista
 */
export default function ContentList({ contentType, searchFilters, onEdit }) {
  const { data: contents = [], isLoading, isError, error } = useContents();
  const { data: categories = [] } = useCategories();

  console.log('ContentList - contents:', contents);
  console.log('ContentList - contentType:', contentType);
  console.log('ContentList - searchFilters:', searchFilters);
  console.log('ContentList - categories:', categories);

  // Crear un mapa de categorías por ID para búsqueda rápida
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach(category => {
      map[category.id] = category.name;
    });
    return map;
  }, [categories]);

  // Función para obtener el nombre de categoría a partir de un ID o un objeto categoría
  const getCategoryName = useCallback(
    category => {
      if (!category) return 'Sin categoría';

      // Si es un objeto con el nombre de categoría, usarlo directamente
      if (typeof category === 'object' && category.name) {
        return category.name;
      }

      // Si es un objeto con ID, buscar el nombre en el mapa de categorías
      if (typeof category === 'object' && (category._id || category.id)) {
        const categoryId = category._id || category.id;
        return categoryMap[categoryId] || 'Categoría desconocida';
      }

      // Si es un string que coincide con un ID en el mapa de categorías, mostrar el nombre
      if (typeof category === 'string' && categoryMap[category]) {
        return categoryMap[category];
      }

      // Por defecto, devolver el valor como está (asumiendo que es un nombre de categoría)
      return category;
    },
    [categoryMap]
  );

  // Estado para paginación y modales
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const deleteContent = useDeleteContent();

  // Filtrar contenidos según el tipo seleccionado y los filtros de búsqueda
  const filteredContents = useMemo(() => {
    if (!Array.isArray(contents)) {
      console.error('contents no es un array:', contents);
      return [];
    }

    console.log('Filtrando contenidos:', {
      contents,
      contentType,
      searchFilters
    });

    return contents.filter(content => {
      // Filtrar por tipo de contenido
      if (contentType !== 'all' && content.type !== contentType) {
        return false;
      }

      // Filtrar por término de búsqueda
      if (
        searchFilters.searchTerm &&
        !content.title
          .toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filtrar por categoría
      if (searchFilters.category !== 'Todos') {
        // Obtener el nombre de la categoría del contenido actual
        const contentCategoryName = getCategoryName(content.category);

        // Comparar con el filtro seleccionado
        if (contentCategoryName !== searchFilters.category) {
          return false;
        }
      }

      // Filtrar por estado
      if (
        searchFilters.status !== 'Todos' &&
        content.status !== searchFilters.status
      ) {
        return false;
      }

      return true;
    });
  }, [contents, contentType, searchFilters, getCategoryName]);

  // Calcular contenidos paginados
  const paginatedContents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContents, currentPage, itemsPerPage]);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <LoadingSpinner />
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (isError) {
    return (
      <div className='text-center p-8 text-red-500'>
        Error al cargar los contenidos: {error?.message || 'Error desconocido'}
      </div>
    );
  }

  // Si no hay contenidos después de filtrar, mostrar mensaje
  if (filteredContents.length === 0) {
    return (
      <div className='text-center p-8 text-gray-500'>
        No se encontró contenido para mostrar
      </div>
    );
  }

  // Función para mostrar la vista previa
  const handlePreviewClick = content => {
    setSelectedContent(content);
    setShowPreviewModal(true);
  };

  // Función para cerrar la vista previa
  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  // Función para manejar la intención de eliminar
  const handleDeleteClick = content => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    try {
      await deleteContent.mutateAsync(contentToDelete.id);
      setShowDeleteModal(false);
      setContentToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Manejadores de navegación
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredContents.length / itemsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className='mt-4'>
      {/* Vista de tabla para pantallas medianas y grandes */}
      <div className='hidden md:block border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miniatura</TableHead>
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
            {paginatedContents.length > 0 ? (
              paginatedContents.map(content => (
                <TableRow key={content.id}>
                  <TableCell>
                    <ContentThumbnail
                      content={content}
                      onClick={handlePreviewClick}
                    />
                  </TableCell>
                  <TableCell className='font-medium'>{content.title}</TableCell>
                  <TableCell>{content.type}</TableCell>
                  <TableCell>{getCategoryName(content.category)}</TableCell>
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
                    {content.youtubeId ? (
                      <span className='text-gray-500 text-sm'>
                        Ver en YouTube
                      </span>
                    ) : content.fileUrl ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleDownload(content)}
                        className='inline-flex items-center'
                      >
                        <Download className='h-4 w-4 mr-1' />
                        Descargar
                      </Button>
                    ) : content.url &&
                      (content.type.toLowerCase() === 'pdf' ||
                        content.type.toLowerCase() === 'imagen' ||
                        content.type.toLowerCase() === 'image') ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleDownload(content)}
                        className='inline-flex items-center'
                      >
                        <Download className='h-4 w-4 mr-1' />
                        Descargar
                      </Button>
                    ) : content.url ? (
                      <span className='text-gray-500 text-sm'>
                        Ver en línea
                      </span>
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
                  colSpan={8}
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
        {paginatedContents.length > 0 ? (
          paginatedContents.map(content => (
            <div
              key={content.id}
              className='bg-white p-4 rounded-lg border shadow-sm'
            >
              <div className='flex items-start mb-3'>
                <div className='mr-3'>
                  <ContentThumbnail
                    content={content}
                    onClick={handlePreviewClick}
                  />
                </div>
                <div className='flex-1'>
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

                  <div className='grid grid-cols-2 gap-y-2 text-sm text-gray-600'>
                    <div>
                      <span className='font-medium'>Tipo:</span> {content.type}
                    </div>
                    <div>
                      <span className='font-medium'>Categoría:</span>{' '}
                      {getCategoryName(content.category)}
                    </div>
                    <div>
                      <span className='font-medium'>Fecha:</span> {content.date}
                    </div>
                    <div>
                      <span className='font-medium'>Archivo:</span>{' '}
                      {content.youtubeId ? (
                        <span className='text-gray-500'>Ver en YouTube</span>
                      ) : content.fileUrl ? (
                        <button
                          onClick={handleDownload(content)}
                          className='text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer'
                        >
                          Descargar
                        </button>
                      ) : content.url &&
                        (content.type.toLowerCase() === 'pdf' ||
                          content.type.toLowerCase() === 'imagen' ||
                          content.type.toLowerCase() === 'image') ? (
                        <button
                          onClick={handleDownload(content)}
                          className='text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer'
                        >
                          Descargar
                        </button>
                      ) : content.url ? (
                        <span className='text-gray-500'>Ver en línea</span>
                      ) : (
                        <span className='text-gray-400'>No disponible</span>
                      )}
                    </div>
                  </div>
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

      {/* Modal de vista previa */}
      <PreviewModal
        content={selectedContent}
        isOpen={showPreviewModal}
        onClose={closePreviewModal}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title='Eliminar contenido'
        message={`¿Estás seguro que deseas eliminar "${contentToDelete?.title}"? Esta acción no se puede deshacer.`}
      />

      {/* Paginación - Solo mostrar cuando hay contenido */}
      {filteredContents.length > 0 && (
        <ContentPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredContents.length / itemsPerPage)}
          currentCount={paginatedContents.length}
          totalCount={filteredContents.length}
          pageSize={itemsPerPage}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      )}
    </div>
  );
}
