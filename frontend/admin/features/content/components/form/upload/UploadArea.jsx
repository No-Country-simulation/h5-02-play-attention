import { Upload } from 'lucide-react';

/**
 * Componente para el área de carga de archivos
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo de la interfaz de upload
 */
export function UploadArea({
  contentType,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileUploadClick,
  onLinkClick,
  onYouTubeClick,
  onFileChange
}) {
  return (
    <div
      className='p-4 flex flex-col items-center h-full justify-center'
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
          onClick={onFileUploadClick}
          className='text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100'
        >
          Subir
        </button>
        <button
          type='button'
          onClick={onLinkClick}
          className='text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100'
        >
          Enlace
        </button>
        {(contentType === 'Video' || contentType === 'Artículo') && (
          <button
            type='button'
            onClick={onYouTubeClick}
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
        onChange={onFileChange}
        accept={
          contentType === 'PDF'
            ? '.pdf'
            : contentType === 'Video'
            ? 'video/*'
            : contentType === 'Imagen'
            ? 'image/*'
            : contentType === 'Presentación'
            ? '.ppt,.pptx,.odp'
            : undefined
        }
      />
    </div>
  );
}
