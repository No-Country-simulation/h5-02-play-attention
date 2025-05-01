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

// Componente para previsualizar PDF - versión compacta
function PDFPreview({ url, title, newFile }) {
  if (!url && !newFile) return null;

  return (
    <div className='mt-2 space-y-2 text-xs'>
      {/* Mostrar archivo actual si existe */}
      {url && (
        <div className='p-2 border rounded-md bg-gray-50'>
          <div className='flex items-center gap-1 mb-1'>
            <FileText className='w-3 h-3 text-red-500' />
            <span className='font-medium'>PDF:</span>
          </div>
          <div className='flex items-center justify-between'>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline truncate max-w-[90%]'
            >
              {title || 'Ver PDF'}
            </a>
          </div>
        </div>
      )}

      {/* Mostrar nuevo archivo si se ha seleccionado */}
      {newFile && (
        <div className='p-2 border border-purple-200 rounded-md bg-purple-50'>
          <div className='flex items-center gap-1 mb-1'>
            <FileText className='w-3 h-3 text-purple-500' />
            <span className='font-medium'>Nuevo PDF:</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-purple-600 truncate max-w-[90%]'>
              {newFile.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para previsualizar Video - versión compacta
function VideoPreview({ url, youtubeId, title }) {
  if (!url && !youtubeId) return null;

  return (
    <div className='mt-2 border rounded-md overflow-hidden max-w-full mx-auto'>
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

export default function ContentForm({ initialData, onCancel, onSuccess }) {
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

  // Estado para controlar drag and drop
  const [isDragging, setIsDragging] = useState(false);

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    title: '',
    type: 'Artículo',
    category: '',
    categoryId: '',
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

  // Manejadores para drag and drop
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const fileType = file.type.toLowerCase();

      // Validar tipo de archivo según el tipo de contenido seleccionado
      if (formData.type === 'PDF' && !fileType.includes('pdf')) {
        alert('Por favor selecciona un archivo PDF');
        return;
      }

      if (formData.type === 'Video' && !fileType.includes('video/')) {
        alert('Por favor selecciona un archivo de video');
        return;
      }

      if (formData.type === 'Imagen' && !fileType.includes('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }

      if (
        formData.type === 'Presentación' &&
        !(
          fileType.includes('presentation') ||
          file.name.endsWith('.ppt') ||
          file.name.endsWith('.pptx') ||
          file.name.endsWith('.odp')
        )
      ) {
        alert(
          'Por favor selecciona un archivo de presentación (PPT, PPTX o ODP)'
        );
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file,
        url: createObjectURL(file),
        youtubeId: null
      }));
    }
  };

  // Manejar cambios en el archivo para la entrada de archivo estándar
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

      if (formData.type === 'Imagen' && !fileType.includes('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }

      if (
        formData.type === 'Presentación' &&
        !(
          fileType.includes('presentation') ||
          file.name.endsWith('.ppt') ||
          file.name.endsWith('.pptx') ||
          file.name.endsWith('.odp')
        )
      ) {
        alert(
          'Por favor selecciona un archivo de presentación (PPT, PPTX o ODP)'
        );
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

    // Validación específica según el tipo de contenido
    if (formData.type === 'PDF' && !formData.file && !formData.url) {
      newErrors.content = 'Debes subir un archivo PDF o proporcionar un enlace';
    } else if (
      formData.type === 'Video' &&
      !formData.file &&
      !formData.url &&
      !formData.youtubeId
    ) {
      newErrors.content =
        'Debes subir un video, proporcionar un enlace o agregar un video de YouTube';
    } else if (formData.type === 'Imagen' && !formData.file && !formData.url) {
      newErrors.content = 'Debes subir una imagen o proporcionar un enlace';
    } else if (
      formData.type === 'Presentación' &&
      !formData.file &&
      !formData.url
    ) {
      newErrors.content =
        'Debes subir una presentación o proporcionar un enlace';
    } else if (
      formData.type === 'Artículo' &&
      !formData.content.trim() &&
      !formData.file &&
      !formData.url &&
      !formData.youtubeId
    ) {
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

    // Si hay un archivo adjunto, no enviamos la URL generada localmente
    if (contentData.file) {
      // Si estamos enviando un archivo, no enviar la url temporal creada con createObjectURL
      contentData.url = null;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(contentData);
      } else {
        await createMutation.mutateAsync(contentData);
      }

      // Después de guardar, volvemos a la lista
      onCancel();

      // Si hay un callback de éxito, lo llamamos
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar contenido:', error);
      // El toast ya se muestra desde los hooks
    }
  };

  return (
    <div className='p-4'>
      <div className='flex items-center mb-4'>
        <button
          onClick={onCancel}
          className='mr-3 flex items-center bg-transparent border-0 p-0 cursor-pointer'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Volver
        </button>
        <h2 className='text-xl font-bold flex-1'>
          {isEditing ? 'Editar Contenido' : 'Crear Contenido'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className='mb-4'>
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
            className={`w-full p-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
            placeholder='Ingresa un título descriptivo'
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
          )}
        </div>

        {/* Tipo y Categoría en una fila */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Tipo <span className='text-red-500'>*</span>
            </label>
            <select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              disabled={isSubmitting}
            >
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
              <div className='flex items-center text-sm text-gray-500 p-2 border border-gray-300 rounded-md'>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Cargando...
              </div>
            ) : (
              <select
                id='categoryId'
                name='categoryId'
                value={formData.categoryId}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                } rounded-md`}
                disabled={isSubmitting}
              >
                <option disabled value=''>
                  Selecciona categoría
                </option>
                {categories.length > 0 ? (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay categorías</option>
                )}
              </select>
            )}
            {errors.category && (
              <p className='text-red-500 text-sm mt-1'>{errors.category}</p>
            )}
          </div>
        </div>

        {/* Contenido/Descripción */}
        <div className='mb-4'>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Contenido o Descripción
          </label>
          <textarea
            id='content'
            name='content'
            rows={3}
            value={formData.content}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
            placeholder='Ingresa el contenido o una descripción'
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
          )}
        </div>

        {/* Subir archivo - simplificado */}
        <div className='mb-4 border border-dashed border-gray-300 rounded-md bg-gray-50'>
          <div
            className='p-4 flex flex-col items-center'
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className='text-center mb-3'>
              <Upload className='h-5 w-5 mx-auto mb-2 text-gray-400' />
              <div className='text-sm text-gray-500'>
                Arrastra archivos o selecciona una opción
              </div>
            </div>

            <div className='flex gap-2 justify-center'>
              <button
                type='button'
                onClick={handleFileUploadClick}
                className='text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100'
              >
                Subir
              </button>
              <button
                type='button'
                onClick={handleLinkClick}
                className='text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100'
              >
                Enlace
              </button>
              {(formData.type === 'Video' || formData.type === 'Artículo') && (
                <button
                  type='button'
                  onClick={handleYouTubeClick}
                  className='text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100'
                >
                  YouTube
                </button>
              )}
            </div>

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
                  : formData.type === 'Imagen'
                  ? 'image/*'
                  : formData.type === 'Presentación'
                  ? '.ppt,.pptx,.odp'
                  : undefined
              }
            />
          </div>

          {/* Vista previa de archivos */}
          {(formData.file || formData.url || formData.youtubeId) && (
            <div className='px-4 pb-4 border-t border-gray-200 mt-2 pt-3'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium text-gray-700'>
                  Vista previa
                </h4>
                <button
                  type='button'
                  onClick={() => {
                    if (formData.file)
                      document.getElementById('file').value = '';
                    setFormData(prev => ({
                      ...prev,
                      file: null,
                      url: null,
                      youtubeId: null
                    }));
                  }}
                  className='text-xs text-gray-500 hover:text-gray-700 flex items-center'
                >
                  <X className='h-3 w-3 mr-1' /> Quitar
                </button>
              </div>

              {/* PDF Preview */}
              {formData.type === 'PDF' && (
                <div className='flex items-center p-2 border rounded-md bg-white'>
                  <FileText className='h-8 w-8 text-red-500 mr-3' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {formData.file
                        ? formData.file.name
                        : formData.title || 'Documento PDF'}
                    </p>
                    {formData.url && !formData.file && (
                      <a
                        href={formData.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-blue-600 hover:underline'
                      >
                        Ver PDF
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {formData.type === 'Video' && (
                <div>
                  {formData.youtubeId ? (
                    <div className='flex items-center p-2 border rounded-md bg-white'>
                      <div className='h-10 w-10 bg-red-100 rounded-md overflow-hidden mr-3 flex items-center justify-center'>
                        <Video className='h-6 w-6 text-red-500' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {formData.title || 'Video de YouTube'}
                        </p>
                        <p className='text-xs text-gray-500'>
                          YouTube
                        </p>
                      </div>
                    </div>
                  ) : formData.file ? (
                    <div className='flex items-center p-2 border rounded-md bg-white'>
                      <div className='w-16 h-16 bg-black rounded-md overflow-hidden mr-3 flex items-center justify-center'>
                        <video
                          src={URL.createObjectURL(formData.file)}
                          className='max-h-full max-w-full'
                        >
                          Tu navegador no soporta videos.
                        </video>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {formData.file.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Video subido
                        </p>
                      </div>
                    </div>
                  ) : formData.url ? (
                    <div className='flex items-center p-2 border rounded-md bg-white'>
                      <Video className='h-8 w-8 text-blue-500 mr-3' />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {formData.title || 'Video enlazado'}
                        </p>
                        <a 
                          href={formData.url} 
                          target='_blank' 
                          rel='noopener noreferrer' 
                          className='text-xs text-blue-600 hover:underline'
                        >
                          Ver video
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Imagen Preview */}
              {formData.type === 'Imagen' && (
                <div>
                  {formData.file ? (
                    <div className='flex items-center p-2 border rounded-md bg-white'>
                      <div className='w-16 h-16 rounded-md overflow-hidden mr-3 flex items-center justify-center bg-gray-100'>
                        <img
                          src={URL.createObjectURL(formData.file)}
                          alt={formData.title || 'Vista previa'}
                          className='max-h-full max-w-full object-contain'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {formData.file.name}
                        </p>
                        <p className='text-xs text-gray-500'>Imagen subida</p>
                      </div>
                    </div>
                  ) : (
                    formData.url && (
                      <div className='flex items-center p-2 border rounded-md bg-white'>
                        <FileText className='h-8 w-8 text-blue-500 mr-3' />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {formData.title || 'Imagen enlazada'}
                          </p>
                          <a
                            href={formData.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-xs text-blue-600 hover:underline'
                          >
                            Ver imagen
                          </a>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Otros tipos */}
              {(formData.type === 'Presentación' ||
                (formData.type === 'Artículo' &&
                  (formData.file || formData.url))) && (
                <div className='flex items-center p-2 border rounded-md bg-white'>
                  <FileText className='h-8 w-8 text-blue-500 mr-3' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {formData.file
                        ? formData.file.name
                        : formData.title || 'Archivo'}
                    </p>
                    {formData.url && !formData.file && (
                      <a
                        href={formData.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-blue-600 hover:underline'
                      >
                        Ver archivo
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Estado y botones de acción */}
        <div className='flex items-center mt-4 gap-3'>
          <select
            id='status'
            name='status'
            value={formData.status}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md'
          >
            <option value='Borrador'>Borrador</option>
            <option value='Publicado'>Publicado</option>
          </select>

          <div className='flex gap-2 ml-auto'>
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50'
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-purple-700 text-white rounded-md text-sm hover:bg-purple-800'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className='flex items-center'>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Guardando...
                </span>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Modales para YouTube y enlaces */}
      <Dialog open={youtubeModalOpen} onOpenChange={setYoutubeModalOpen}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Agregar video de YouTube</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-2 py-2'>
            <label className='text-sm font-medium'>
              Pega el enlace del video:
            </label>
            <input
              type='text'
              value={tempYoutubeUrl}
              onChange={e => setTempYoutubeUrl(e.target.value)}
              placeholder='https://www.youtube.com/watch?v=...'
              className='w-full p-2 border border-gray-300 rounded-md'
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
                className='h-9 px-4 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type='button'
              onClick={handleYoutubeSubmit}
              variant='default'
              className='bg-purple-700 hover:bg-purple-800 h-9 px-4'
            >
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Agregar enlace</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-2 py-2'>
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
                className='h-9 px-4 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type='button'
              onClick={handleLinkSubmit}
              variant='default'
              className='bg-purple-700 hover:bg-purple-800 h-9 px-4'
            >
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
