import { FileText } from 'lucide-react';

/**
 * Componente para previsualizar PDF
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo de la previsualización
 */
export function PDFPreview({ url, title, newFile }) {
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
