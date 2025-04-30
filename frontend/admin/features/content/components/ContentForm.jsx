'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import {
  ArrowLeft,
  Save,
  Upload,
  Link2,
  X,
  Bookmark,
  Globe,
  Loader2,
  FileText,
  Video
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/shared/ui/dialog';
import {
  useCreateContent,
  useUpdateContent,
  useCategories
} from '../lib/hooks';

/**
 * Componente para crear y editar contenido
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo del formulario
 * y el principio de Inversión de Dependencias (DIP) recibiendo callbacks externos
 */

// Componente para previsualizar PDF
function PDFPreview({ url, title, newFile }) {
  if (!url && !newFile) return null;

  return (
    <div className='mt-4 space-y-4'>
      {/* Mostrar archivo actual si existe */}
      {url && (
        <div className='p-4 border rounded-lg bg-gray-50'>
          <div className='flex items-center gap-2 mb-2'>
            <FileText className='w-5 h-5 text-red-500' />
            <span className='font-medium'>PDF actual:</span>
          </div>
          <div className='flex items-center justify-between'>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline truncate max-w-[80%]'
            >
              {title || 'Ver PDF actual'}
            </a>
          </div>
        </div>
      )}

      {/* Mostrar nuevo archivo si se ha seleccionado */}
      {newFile && (
        <div className='p-4 border-2 border-purple-200 rounded-lg bg-purple-50'>
          <div className='flex items-center gap-2 mb-2'>
            <FileText className='w-5 h-5 text-purple-500' />
            <span className='font-medium'>Nuevo PDF seleccionado:</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-purple-600 truncate max-w-[80%]'>
              {newFile.name}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => {
                document.getElementById('file').value = '';
                setFormData(prev => ({
                  ...prev,
                  file: null,
                  url: prev.url || initialData?.url // Restaurar URL anterior
                }));
              }}
              className='text-purple-600 hover:text-purple-700'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para previsualizar Video
function VideoPreview({ url, youtubeId, title }) {
  if (!url && !youtubeId) return null;

  return (
    <div className='mt-4 border rounded-lg overflow-hidden'>
      {youtubeId ? (
        <div className='relative pb-[56.25%] h-0'>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            className='absolute top-0 left-0 w-full h-full'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      ) : (
        url && (
          <div className='relative pb-[56.25%] h-0'>
            <video
              src={url}
              controls
              className='absolute top-0 left-0 w-full h-full'
              title={title}
            >
              Tu navegador no soporta la reproducción de videos.
            </video>
          </div>
        )
      )}
    </div>
  );
}

export default function ContentForm({ initialData, onCancel }) {
  const isEditing = !!initialData;

  // Hooks para crear/editar contenido
  const createMutation = useCreateContent();
  const updateMutation = isEditing ? useUpdateContent(initialData.id) : null;

  // Obtener categorías desde el backend
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();

  // Estado para controlar envío
  const isSubmitting =
    createMutation.isPending || updateMutation?.isPending || false;

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    title: '',
    type: 'Artículo',
    category: '', // Ahora será el ID de la categoría
    categoryId: '', // Añadimos categoryId para almacenar el ID
    content: '',
    status: 'Borrador',
    file: null,
    youtubeId: null,
    url: null
  });

  // Estados para los modales
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [tempYoutubeUrl, setTempYoutubeUrl] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [youtubeError, setYoutubeError] = useState('');

  // Validación del formulario
  const [errors, setErrors] = useState({});

  // Referencias para los objetos URL creados
  const objectURLs = useRef([]);

  // Limpiar los objectURLs cuando el componente se desmonte
  useEffect(() => {
    return () => {
      // Limpiar cualquier URL creada
      objectURLs.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Función para crear y registrar una nueva URL para objetos
  const createObjectURL = file => {
    if (!file) return '';
    const url = URL.createObjectURL(file);
    objectURLs.current.push(url);
    return url;
  };

  // Si estamos editando, cargamos la información inicial
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Asegurar que se mantenga el ID de la categoría si ya existe
        categoryId: initialData.categoryId || '',
        file: null // Siempre reiniciamos el archivo
      });
    }
  }, [initialData]);

  // Cuando se cargan las categorías y estamos editando, necesitamos establecer la categoría correcta
  useEffect(() => {
    // Si tenemos categorías y estamos editando, intentamos encontrar la categoría por nombre
    if (categories.length > 0 && initialData && initialData.category) {
      // Intentar encontrar por ID primero si está disponible
      if (initialData.categoryId) {
        const foundCategory = categories.find(
          cat => cat.id === initialData.categoryId
        );
        if (foundCategory) {
          setFormData(prev => ({
            ...prev,
            categoryId: foundCategory.id,
            category: foundCategory.name
          }));
          return;
        }
      }

      // Si no hay ID o no se encontró por ID, intentar buscar por nombre
      const foundCategory = categories.find(
        cat =>
          cat.name.toLowerCase() ===
          (typeof initialData.category === 'string'
            ? initialData.category.toLowerCase()
            : initialData.category?.name?.toLowerCase() || '')
      );

      if (foundCategory) {
        setFormData(prev => ({
          ...prev,
          categoryId: foundCategory.id,
          category: foundCategory.name
        }));
      } else if (categories.length > 0) {
        // Si no se encuentra, seleccionar la primera categoría disponible
        setFormData(prev => ({
          ...prev,
          categoryId: categories[0].id,
          category: categories[0].name
        }));
      }
    } else if (categories.length > 0 && !formData.categoryId) {
      // Si no estamos editando y hay categorías, seleccionar la primera por defecto
      setFormData(prev => ({
        ...prev,
        categoryId: categories[0].id,
        category: categories[0].name
      }));
    }
  }, [categories, initialData]);

  // Manejar cambios en los campos del formulario
  const handleChange = e => {
    const { name, value } = e.target;

    // Caso especial para el cambio de categoría
    if (name === 'categoryId') {
      const selectedCategory = categories.find(cat => cat.id === value);
      setFormData(prev => ({
        ...prev,
        categoryId: value,
        category: selectedCategory ? selectedCategory.name : prev.category
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manejar cambios en el archivo
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.toLowerCase();

      // Validar tipo de archivo según el tipo de contenido
      if (formData.type === 'PDF' && !fileType.includes('pdf')) {
        alert('Por favor selecciona un archivo PDF');
        return;
      }

      if (formData.type === 'Video' && !fileType.includes('video/')) {
        alert('Por favor selecciona un archivo de video');
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file,
        // Si hay un archivo nuevo, limpiamos la URL anterior y el youtubeId
        url: createObjectURL(file),
        youtubeId: null
      }));
    }
  };

  // Manejadores para los botones de subida alternativa
  const handleYouTubeClick = () => {
    // Abrir el modal para ingresar URL de YouTube
    setTempYoutubeUrl('');
    setYoutubeError('');
    setYoutubeModalOpen(true);
  };

  const handleYoutubeSubmit = () => {
    // Validación básica de URL de YouTube
    if (!tempYoutubeUrl.trim()) {
      setYoutubeError('Por favor ingresa una URL');
      return;
    }

    if (
      tempYoutubeUrl.includes('youtube.com/watch') ||
      tempYoutubeUrl.includes('youtu.be/')
    ) {
      // Extraer información del video
      const videoId = extractYoutubeVideoId(tempYoutubeUrl);
      if (videoId) {
        setFormData(prev => ({
          ...prev,
          type: 'Video',
          youtubeId: videoId,
          url: tempYoutubeUrl // Guardamos la URL completa
        }));
        setYoutubeModalOpen(false);
      } else {
        setYoutubeError(
          'No se pudo extraer el ID del video. Verifica que la URL sea correcta.'
        );
      }
    } else {
      setYoutubeError(
        'La URL no parece ser de YouTube. Por favor ingresa un enlace válido de YouTube.'
      );
    }
  };

  const handleFileUploadClick = () => {
    // Activar el input de archivo
    document.getElementById('file').click();
  };

  const handleLinkClick = () => {
    // Abrir el modal para ingresar el enlace
    setTempLink('');
    setLinkModalOpen(true);
  };

  const handleLinkSubmit = () => {
    if (tempLink.trim()) {
      console.log('Enlace agregado:', tempLink);
      // Agregar el enlace al contenido
      setFormData(prev => ({
        ...prev,
        content: `${prev.content}\n\nEnlace: ${tempLink}`
      }));
      setLinkModalOpen(false);
    }
  };

  // Función auxiliar para extraer el ID de video de YouTube de una URL
  const extractYoutubeVideoId = url => {
    try {
      // Para URLs en formato youtube.com/watch?v=VIDEO_ID
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
      }
      // Para URLs en formato youtu.be/VIDEO_ID
      else if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts.length > 1) {
          // Eliminar cualquier parámetro adicional
          return parts[1].split('?')[0].split('&')[0];
        }
      }
    } catch (error) {
      console.error('Error al extraer ID de video:', error);
    }
    return null;
  };

  // Opciones disponibles para el formulario
  const typeOptions = ['Artículo', 'Video', 'PDF', 'Imagen', 'Presentación'];
  const statusOptions = ['Borrador', 'Publicado'];

  // Función para validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};

    // Validación de campos requeridos por el backend
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'El título no puede exceder los 100 caracteres';
    }

    if (!formData.type) {
      newErrors.type = 'El tipo de recurso es obligatorio';
    }

    if (!formData.categoryId) {
      newErrors.category = 'La categoría es obligatoria';
    }

    // La descripción es requerida si no hay archivo o video de YouTube
    if (!formData.content.trim() && !formData.file && !formData.youtubeId) {
      newErrors.content = 'Debes proporcionar contenido, un archivo o un video';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Crear el objeto de datos para enviar al backend
    const contentData = {
      ...formData,
      description: formData.content, // Mapear content a description
      category: formData.categoryId
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(contentData);
      } else {
        await createMutation.mutateAsync(contentData);
      }

      // Después de guardar, volvemos a la lista
      onCancel();
    } catch (error) {
      console.error('Error al guardar contenido:', error);
      // El toast ya se muestra desde los hooks
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg border'>
      <div className='flex items-center mb-6'>
        <Button onClick={onCancel} variant='ghost' className='mr-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver
        </Button>
        <h2 className='text-2xl font-bold'>
          {isEditing ? 'Editar Contenido' : 'Crear Nuevo Contenido'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Título */}
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Título <span className='text-red-500'>*</span>
          </label>
          <input
            id='title'
            name='title'
            type='text'
            required
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300`}
            placeholder='Ingresa un título descriptivo'
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
          )}
        </div>

        {/* Tipo y Categoría (siempre en columna en móvil y tablet, en fila en desktop) */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Tipo de Contenido <span className='text-red-500'>*</span>
            </label>
            <select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleChange}
              className={`w-full p-3 h-12 border ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300`}
              disabled={isSubmitting}
            >
              <option disabled>Tipo de contenido</option>
              {typeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className='text-red-500 text-sm mt-1'>{errors.type}</p>
            )}
          </div>

          {/* Selector de categorías */}
          <div>
            <label
              htmlFor='categoryId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Categoría <span className='text-red-500'>*</span>
            </label>
            {loadingCategories ? (
              <div className='flex items-center text-sm text-gray-500'>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Cargando categorías...
              </div>
            ) : (
              <select
                id='categoryId'
                name='categoryId'
                value={formData.categoryId}
                onChange={handleChange}
                className={`w-full p-3 h-12 border ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300`}
                disabled={isSubmitting}
              >
                <option disabled value=''>
                  Selecciona una categoría
                </option>
                {categories.length > 0 ? (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay categorías disponibles</option>
                )}
              </select>
            )}
            {errors.category && (
              <p className='text-red-500 text-sm mt-1'>{errors.category}</p>
            )}
            {categories.length === 0 && !loadingCategories && (
              <p className='text-amber-500 text-sm mt-1'>
                No hay categorías disponibles. Por favor, crea una categoría
                primero.
              </p>
            )}
          </div>
        </div>

        {/* Contenido/Descripción */}
        <div>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Contenido o Descripción
          </label>
          <textarea
            id='content'
            name='content'
            rows={6}
            value={formData.content}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300`}
            placeholder='Ingresa el contenido o una descripción detallada'
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
          )}
        </div>

        {/* Subir archivo */}
        <div className='space-y-4'>
          {/* Mostrar previsualización según el tipo */}
          {formData.type === 'PDF' && (
            <>
              <PDFPreview
                url={!formData.file ? formData.url || initialData?.url : null}
                title={formData.title}
                newFile={formData.file}
              />
              <div className='flex gap-4 mt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleFileUploadClick}
                >
                  <Upload className='w-4 h-4 mr-2' />
                  {formData.file
                    ? 'Cambiar PDF'
                    : initialData?.url
                    ? 'Cambiar PDF'
                    : 'Subir PDF'}
                </Button>
                {!formData.file && !formData.url && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleLinkClick}
                  >
                    <Link2 className='w-4 h-4 mr-2' />
                    Agregar enlace a PDF
                  </Button>
                )}
              </div>
            </>
          )}

          {formData.type === 'Video' && (
            <>
              <VideoPreview
                url={
                  !formData.file
                    ? formData.url || initialData?.url
                    : formData.file
                    ? URL.createObjectURL(formData.file)
                    : null
                }
                youtubeId={formData.youtubeId || initialData?.youtubeId}
                title={formData.title}
              />
              {formData.file && (
                <div className='p-4 border-2 border-purple-200 rounded-lg bg-purple-50 mt-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Video className='w-5 h-5 text-purple-500' />
                      <span className='font-medium'>
                        Nuevo video seleccionado:
                      </span>
                      <span className='text-purple-600'>
                        {formData.file.name}
                      </span>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        document.getElementById('file').value = '';
                        setFormData(prev => ({
                          ...prev,
                          file: null,
                          url: prev.url || initialData?.url // Restaurar URL anterior
                        }));
                      }}
                      className='text-purple-600 hover:text-purple-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
              <div className='flex gap-4 mt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleFileUploadClick}
                >
                  <Upload className='w-4 h-4 mr-2' />
                  {formData.file
                    ? 'Cambiar video'
                    : initialData?.url
                    ? 'Cambiar video'
                    : 'Subir video'}
                </Button>
                {!formData.file && !formData.url && !formData.youtubeId && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleYouTubeClick}
                  >
                    <Globe className='w-4 h-4 mr-2' />
                    Agregar video de YouTube
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Input oculto para subida de archivos */}
          <input
            type='file'
            id='file'
            className='hidden'
            onChange={handleFileChange}
            accept={
              formData.type === 'PDF'
                ? '.pdf'
                : formData.type === 'Video'
                ? 'video/*'
                : undefined
            }
          />
        </div>

        {/* Estado y botones de acción */}
        <div className='flex flex-col pt-4 border-t'>
          <div className='mb-4 w-full'>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Estado
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='h-12 w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 appearance-none bg-white bg-no-repeat'
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option disabled>Estado</option>
              <option value='Borrador' className='flex items-center'>
                Borrador
              </option>
              <option value='Publicado'>Publicado</option>
            </select>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <Button
              type='button'
              onClick={onCancel}
              variant='outline'
              className='h-12 border border-gray-300 rounded-lg hover:bg-gray-50'
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              type='submit'
              variant='default'
              className='bg-purple-700 hover:bg-purple-800 h-12'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className='flex items-center'>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Guardando...
                </div>
              ) : formData.status === 'Borrador' ? (
                <>
                  <Bookmark className='mr-2 h-4 w-4' />
                  {isEditing ? 'Guardar como borrador' : 'Guardar borrador'}
                </>
              ) : (
                <>
                  <Globe className='mr-2 h-4 w-4' />
                  {isEditing ? 'Actualizar publicación' : 'Publicar'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Modales para YouTube y enlaces */}
      <Dialog open={youtubeModalOpen} onOpenChange={setYoutubeModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Agregar video de YouTube</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4 py-4'>
            <label className='text-sm font-medium'>
              Pega el enlace del video de YouTube:
            </label>
            <input
              type='text'
              value={tempYoutubeUrl}
              onChange={e => setTempYoutubeUrl(e.target.value)}
              placeholder='https://www.youtube.com/watch?v=...'
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300'
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleYoutubeSubmit();
                }
              }}
            />
            {youtubeError && (
              <p className='text-red-500 text-sm'>{youtubeError}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type='button'
                variant='outline'
                className='h-10 px-4 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type='button'
              onClick={handleYoutubeSubmit}
              variant='default'
              className='bg-purple-700 hover:bg-purple-800 h-10 px-4'
            >
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Agregar enlace</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4 py-4'>
            <label className='text-sm font-medium'>Pega el enlace:</label>
            <input
              type='url'
              value={tempLink}
              onChange={e => setTempLink(e.target.value)}
              placeholder='https://...'
              className='w-full p-2 border border-gray-300 rounded-md'
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleLinkSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type='button'
                variant='outline'
                className='h-10 px-4 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type='button'
              onClick={handleLinkSubmit}
              variant='default'
              className='bg-purple-700 hover:bg-purple-800 h-10 px-4'
            >
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
