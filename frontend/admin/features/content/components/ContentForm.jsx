'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import {
  ArrowLeft,
  Save,
  Upload,
  Link2,
  X,
  Bookmark,
  Globe
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/shared/ui/dialog';

/**
 * Componente para crear y editar contenido
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo del formulario
 * y el principio de Inversión de Dependencias (DIP) recibiendo callbacks externos
 */
export default function ContentForm({ initialData, onCancel }) {
  const isEditing = !!initialData;

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    title: '',
    type: 'Artículo',
    category: 'Tutoriales',
    content: '',
    status: 'Borrador',
    file: null,
    youtubeId: null
  });

  // Estados para los modales
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [tempYoutubeUrl, setTempYoutubeUrl] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [youtubeError, setYoutubeError] = useState('');

  // Si estamos editando, cargamos la información inicial
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        file: null // Siempre reiniciamos el archivo
      });
    }
  }, [initialData]);

  // Manejar cambios en los campos del formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el archivo
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0]
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
          content: `${prev.content}\n\nVideo de YouTube: ${tempYoutubeUrl}`,
          youtubeId: videoId
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
  const typeOptions = ['Artículo', 'Video', 'PDF', 'Presentación'];
  const categoryOptions = ['Tutoriales', 'Educativo', 'Médico', 'Otro'];
  const statusOptions = ['Borrador', 'Publicado'];

  // Manejar el envío del formulario
  const handleSubmit = e => {
    e.preventDefault();
    // Aquí iría la lógica para guardar o actualizar el contenido
    console.log('Guardando contenido:', formData);
    // Después de guardar, volvemos a la lista
    onCancel();
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
            Título
          </label>
          <input
            id='title'
            name='title'
            type='text'
            required
            value={formData.title}
            onChange={handleChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300'
            placeholder='Ingresa un título descriptivo'
          />
        </div>

        {/* Tipo y Categoría (fila) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Tipo de Contenido
            </label>
            <select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleChange}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300'
            >
              <option disabled>Tipo de contenido</option>
              {typeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Categoría
            </label>
            <select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300'
            >
              <option disabled>Categoría</option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300'
            placeholder='Ingresa el contenido o una descripción detallada'
          />
        </div>

        {/* Subir archivo */}
        <div>
          <p className='block text-sm font-medium text-gray-700 mb-1'>
            Archivo (opcional)
          </p>

          {/* Drag and drop con botones integrados */}
          <div className='flex items-center justify-center w-full'>
            <div className='relative flex flex-col items-center justify-center w-full h-40 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100'>
              {/* Botones en la esquina superior derecha */}
              <div className='absolute top-3 right-3 flex gap-2'>
                <button
                  type='button'
                  onClick={handleYouTubeClick}
                  className='w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border cursor-pointer'
                  title='Agregar video de YouTube'
                >
                  <img
                    src='/youtube-icon.svg'
                    alt='YouTube'
                    className='w-4 h-4'
                  />
                </button>

                <button
                  type='button'
                  onClick={handleLinkClick}
                  className='w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border cursor-pointer'
                  title='Agregar enlace'
                >
                  <Link2 className='w-4 h-4 text-gray-600' />
                </button>

                <button
                  type='button'
                  onClick={handleFileUploadClick}
                  className='w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border cursor-pointer'
                  title='Subir archivo'
                >
                  <Upload className='w-4 h-4 text-gray-600' />
                </button>
              </div>

              <label
                htmlFor='file'
                className='cursor-pointer w-full h-full flex flex-col items-center justify-center'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <Upload className='w-8 h-8 mb-3 text-gray-400' />
                  <p className='mb-2 text-sm text-gray-500 text-center'>
                    <span className='font-semibold'>Arrastra y suelta</span>{' '}
                    archivos aquí
                  </p>
                  <p className='text-xs text-gray-500 text-center'>
                    o{' '}
                    <span className='text-blue-500 underline'>
                      selecciona archivos
                    </span>{' '}
                    desde tu dispositivo
                  </p>
                  {formData.file && (
                    <p className='mt-2 text-sm text-green-600 font-medium'>
                      {formData.file.name}
                    </p>
                  )}
                </div>
              </label>
              <input
                id='file'
                name='file'
                type='file'
                className='hidden'
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Vista previa de video de YouTube */}
          {formData.youtubeId && (
            <div className='mt-4'>
              <p className='text-sm font-medium text-gray-700 mb-2'>
                Vista previa del video:
              </p>
              <div
                className='relative w-full'
                style={{ paddingBottom: '56.25%' }}
              >
                <iframe
                  className='absolute top-0 left-0 w-full h-full rounded-lg shadow-md'
                  src={`https://www.youtube.com/embed/${formData.youtubeId}`}
                  title='Vista previa de YouTube'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
              <div className='flex justify-end mt-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='text-red-500 hover:text-red-700'
                  onClick={() =>
                    setFormData(prev => ({ ...prev, youtubeId: null }))
                  }
                >
                  Eliminar video
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Estado y botones de acción */}
        <div className='flex flex-col sm:flex-row justify-between items-center pt-4 border-t'>
          <div>
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
              className='h-12 w-full sm:w-56 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 appearance-none bg-white bg-no-repeat'
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

          <div className='flex gap-4 mt-4 sm:mt-0'>
            <Button
              type='button'
              onClick={onCancel}
              variant='outline'
              className='h-12 px-6 border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              Cancelar
            </Button>

            <Button
              type='submit'
              variant='default'
              className='bg-purple-700 hover:bg-purple-800 h-12 px-6'
            >
              {formData.status === 'Borrador' ? (
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
