'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useContentForm } from './hooks/useContentForm';
import { useFileHandling } from './hooks/useFileHandling';
import { useLinkHandling } from './hooks/useLinkHandling';
import { UploadArea } from './upload/UploadArea';
import { FilePreview } from './previews/FilePreview';
import { YouTubeModal } from './modals/YouTubeModal';
import { LinkModal } from './modals/LinkModal';

/**
 * Componente principal para el formulario de contenido
 * Sigue el principio de Responsabilidad Única (SRP) delegando la lógica a hooks
 * y la UI a componentes individuales
 */
export default function ContentForm({ initialData, onCancel, onSuccess }) {
  // Referencias para el control directo de elementos DOM
  const categorySelectRef = useRef(null);

  // Hook para manejar el formulario
  const {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isEditing,
    categories,
    loadingCategories,
    typeOptions
  } = useContentForm(initialData, onCancel, onSuccess);

  // Controlar directamente el valor del select de categoría
  useEffect(() => {
    if (categorySelectRef.current && formData.categoryId) {
      // Si el valor en la UI es diferente al estado, corregirlo
      if (categorySelectRef.current.value !== formData.categoryId) {
        console.log(
          'Corrigiendo select de categoría desde UI:',
          formData.categoryId
        );
        categorySelectRef.current.value = formData.categoryId;
      }
    }
  }, [formData.categoryId]);

  // Hook para manejar archivos
  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    handleFileUploadClick,
    clearFiles,
    createObjectURL
  } = useFileHandling(formData, setFormData);

  // Hook para manejar enlaces y YouTube
  const {
    youtubeModalOpen,
    setYoutubeModalOpen,
    linkModalOpen,
    setLinkModalOpen,
    tempYoutubeUrl,
    setTempYoutubeUrl,
    tempLink,
    setTempLink,
    youtubeError,
    handleYouTubeClick,
    handleLinkClick,
    handleYoutubeSubmit,
    handleLinkSubmit
  } = useLinkHandling(formData, setFormData);

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
                ref={categorySelectRef}
                onChange={e => {
                  // Capturar el valor actual
                  const selectedValue = e.target.value;
                  console.log(`Cambiando categoría a: ${selectedValue}`);

                  // Aplicar el cambio al estado local primero
                  const selectedCategory = categories.find(
                    c => c.id === selectedValue
                  );
                  setFormData(prev => ({
                    ...prev,
                    categoryId: selectedValue,
                    category: selectedCategory?.name || prev.category
                  }));

                  // Como respaldo, asegurarse que el DOM refleje el cambio
                  if (categorySelectRef.current) {
                    categorySelectRef.current.value = selectedValue;
                  }
                }}
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
            Contenido o Descripción <span className='text-red-500'>*</span>
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

        {/* Área de carga de archivos y previsualización */}
        <div className='mb-4 flex flex-wrap gap-4'>
          {/* Área de carga de archivos - 50% del ancho */}
          <div className='flex-1 min-w-[48%] border border-dashed border-gray-300 rounded-md bg-gray-50'>
            <UploadArea
              contentType={formData.type}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onFileUploadClick={handleFileUploadClick}
              onLinkClick={handleLinkClick}
              onYouTubeClick={handleYouTubeClick}
              onFileChange={handleFileChange}
            />
          </div>

          {/* Previsualización - 50% del ancho */}
          <div className='flex-1 min-w-[48%]'>
            <FilePreview
              formData={formData}
              onClearFiles={clearFiles}
              createObjectURL={createObjectURL}
            />
          </div>
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

      {/* Modales */}
      <YouTubeModal
        isOpen={youtubeModalOpen}
        onClose={() => setYoutubeModalOpen(false)}
        onSubmit={handleYoutubeSubmit}
        url={tempYoutubeUrl}
        onUrlChange={setTempYoutubeUrl}
        error={youtubeError}
      />

      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onSubmit={handleLinkSubmit}
        link={tempLink}
        onLinkChange={setTempLink}
      />
    </div>
  );
}
