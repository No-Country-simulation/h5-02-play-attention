import { FileText, Video, X } from 'lucide-react';

/**
 * Componente para mostrar las previsualizaciones de archivos
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo de la UI de previsualizaciones
 */
export function FilePreview({ formData, onClearFiles, createObjectURL }) {
  if (!formData.file && !formData.url && !formData.youtubeId) {
    return (
      <div className='h-full border border-dashed border-gray-200 rounded-md flex items-center justify-center p-4'>
        <p className='text-sm text-gray-400 text-center'>
          Sube un archivo para ver la vista previa
        </p>
      </div>
    );
  }

  return (
    <div className='h-full border border-gray-200 rounded-md p-4'>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='text-sm font-medium text-gray-700'>Vista previa</h4>
        <button
          type='button'
          onClick={onClearFiles}
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
                <p className='text-xs text-gray-500'>YouTube</p>
              </div>
            </div>
          ) : formData.file ? (
            <div className='flex items-center p-2 border rounded-md bg-white'>
              <div className='w-16 h-16 bg-black rounded-md overflow-hidden mr-3 flex items-center justify-center'>
                <video
                  src={
                    createObjectURL
                      ? createObjectURL(formData.file)
                      : URL.createObjectURL(formData.file)
                  }
                  className='max-h-full max-w-full'
                >
                  Tu navegador no soporta videos.
                </video>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {formData.file.name}
                </p>
                <p className='text-xs text-gray-500'>Video subido</p>
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
                  src={
                    createObjectURL
                      ? createObjectURL(formData.file)
                      : URL.createObjectURL(formData.file)
                  }
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
        (formData.type === 'Artículo' && (formData.file || formData.url))) && (
        <div className='flex items-center p-2 border rounded-md bg-white'>
          <FileText className='h-8 w-8 text-blue-500 mr-3' />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {formData.file ? formData.file.name : formData.title || 'Archivo'}
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
  );
}
