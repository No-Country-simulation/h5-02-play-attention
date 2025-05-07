import React, { useState } from 'react';
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileImage,
  FaVideo,
  FaYoutube
} from 'react-icons/fa';
import { FiDownload, FiEye, FiX } from 'react-icons/fi';

const getFileIcon = type => {
  const iconProps = { className: 'w-4 h-4 mr-1' };
  switch (type.toLowerCase()) {
    case 'pdf':
      return <FaFilePdf {...iconProps} className='text-red-500' />;
    case 'doc':
    case 'docx':
      return <FaFileWord {...iconProps} className='text-blue-500' />;
    case 'ppt':
    case 'pptx':
      return <FaFilePowerpoint {...iconProps} className='text-orange-500' />;
    case 'image':
      return <FaFileImage {...iconProps} className='text-green-500' />;
    case 'video':
      return <FaVideo {...iconProps} className='text-purple-500' />;
    case 'youtube':
      return <FaYoutube {...iconProps} className='text-red-600' />;
    default:
      return <FaFilePdf {...iconProps} className='text-gray-500' />;
  }
};

// Función para extraer el ID de un video de YouTube de una URL
const getYoutubeVideoId = url => {
  if (!url) return null;

  // Patrones para URLs de YouTube
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i, // youtube.com/watch?v=XXXX
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/i, // youtube.com/embed/XXXX
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/i, // youtu.be/XXXX
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^/?]+)/i // youtube.com/v/XXXX
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Función para verificar si una URL es de YouTube
const isYoutubeUrl = url => {
  return getYoutubeVideoId(url) !== null;
};

export function MaterialsTable({ materials, onDownload }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Esta función manejará la visualización según el tipo de archivo
  const handleView = material => {
    if (material.type.toLowerCase() === 'pdf') {
      // Para PDFs, no hacemos nada porque el botón está deshabilitado
      return;
    } else if (
      material.type.toLowerCase() === 'video' ||
      material.type.toLowerCase() === 'image' ||
      isYoutubeUrl(material.url)
    ) {
      // Para videos, YouTube e imágenes, abrimos el modal
      setSelectedMedia({
        ...material,
        isYoutube: isYoutubeUrl(material.url),
        youtubeId: getYoutubeVideoId(material.url)
      });
    } else {
      // Para otros tipos de archivos, los abrimos según la función onDownload
      onDownload(material, 'view');
    }
  };

  // Cierra el modal
  const closeModal = () => {
    setSelectedMedia(null);
  };

  // Vista para dispositivos móviles y tablets - tarjetas
  const MobileView = () => (
    <div className='space-y-4'>
      {materials.map(material => (
        <div
          key={material.id}
          className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'
        >
          <div className='p-4'>
            <div className='flex justify-between items-start'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  {getFileIcon(material.type)}
                  <h3 className='font-medium text-gray-900'>
                    {material.title}
                  </h3>
                </div>
                {material.description && (
                  <p className='text-sm text-gray-500 mb-2'>
                    {material.description}
                  </p>
                )}
                <div className='flex items-center text-xs text-gray-500 gap-3 mb-3'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-secondary text-purple-900 uppercase'>
                    {material.type}
                  </span>
                  <span>{material.date}</span>
                  <span>{material.size}</span>
                </div>
              </div>
            </div>
            <div className='flex gap-2 mt-2'>
              <button
                onClick={() => onDownload(material, 'download')}
                className='flex-1 py-2 px-3 flex justify-center items-center gap-1 text-xs bg-gray-100 text-gray-700 rounded-md'
              >
                <FiDownload className='w-4 h-4' />
                <span>Descargar</span>
              </button>

              {/* Siempre mostramos el botón Ver, pero deshabilitado para PDFs */}
              <button
                onClick={() => handleView(material)}
                className={`flex-1 py-2 px-3 flex justify-center items-center gap-1 text-xs rounded-md ${
                  material.type.toLowerCase() === 'pdf'
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-primary text-white'
                }`}
                disabled={material.type.toLowerCase() === 'pdf'}
                title={
                  material.type.toLowerCase() === 'pdf'
                    ? 'La vista previa de PDFs estará disponible próximamente'
                    : 'Ver archivo'
                }
              >
                <FiEye className='w-4 h-4' />
                <span>Ver</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Vista para desktop - tabla
  const DesktopView = () => (
    <div className='bg-white shadow rounded-xl overflow-hidden'>
      <table className='min-w-full border border-gray-200'>
        <thead className='bg-secondary'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Título
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Tipo
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Fecha
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Tamaño
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {materials.map(material => (
            <tr key={material.id} className='hover:bg-gray-50'>
              <td className='px-6 py-4'>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-gray-900'>
                    {material.title}
                  </span>
                  {material.description && (
                    <span className='text-xs text-gray-500'>
                      {material.description}
                    </span>
                  )}
                </div>
              </td>
              <td className='px-6 py-4'>
                <span className='inline-flex items-center px-6 py-1 rounded-sm text-xs font-medium bg-secondary text-purple-900 uppercase'>
                  {material.type}
                </span>
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {material.date}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {material.size}
              </td>
              <td className='px-6 py-4 text-right space-x-2'>
                <button
                  onClick={() => onDownload(material, 'download')}
                  className='inline-flex items-center px-2 py-1.5 text-xs font-medium rounded-md border focus:outline-none'
                  title='Descargar archivo'
                >
                  <FiDownload className='w-4 h-4' />
                </button>

                {/* Siempre mostramos el botón Ver, pero deshabilitado para PDFs */}
                <button
                  onClick={() => handleView(material)}
                  className={`inline-flex items-center px-6 py-1.5 text-xs font-medium rounded-md ${
                    material.type.toLowerCase() === 'pdf'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                  disabled={material.type.toLowerCase() === 'pdf'}
                  title={
                    material.type.toLowerCase() === 'pdf'
                      ? 'La vista previa de PDFs estará disponible próximamente'
                      : 'Ver archivo'
                  }
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Modal para mostrar video o imagen
  const MediaViewerModal = () => {
    if (!selectedMedia) return null;

    const isVideo = selectedMedia.type.toLowerCase() === 'video';
    const isImage = selectedMedia.type.toLowerCase() === 'image';
    const isYoutube = selectedMedia.isYoutube;

    return (
      <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-lg w-full max-w-5xl flex flex-col overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b'>
            <h3 className='font-medium'>
              {selectedMedia.title}{' '}
              <span className='text-sm text-gray-500'>
                ({isYoutube ? 'YOUTUBE' : selectedMedia.type.toUpperCase()})
              </span>
            </h3>
            <button
              onClick={closeModal}
              className='text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100'
              title='Cerrar'
            >
              <FiX className='w-5 h-5' />
            </button>
          </div>

          <div className='flex-1 bg-black flex items-center justify-center'>
            {isVideo && !isYoutube && (
              <video
                className='max-h-[70vh] max-w-full'
                controls
                autoPlay
                src={selectedMedia.url}
              >
                Tu navegador no soporta la reproducción de video.
              </video>
            )}

            {isYoutube && selectedMedia.youtubeId && (
              <div className='w-full h-[70vh] flex items-center justify-center'>
                <iframe
                  width='100%'
                  height='100%'
                  src={`https://www.youtube.com/embed/${selectedMedia.youtubeId}?autoplay=1`}
                  title={selectedMedia.title}
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {isImage && (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className='max-h-[70vh] max-w-full object-contain'
              />
            )}
          </div>

          {selectedMedia.description && (
            <div className='p-4 border-t'>
              <p className='text-sm text-gray-600'>
                {selectedMedia.description}
              </p>
            </div>
          )}

          <div className='p-4 border-t flex justify-end'>
            {!isYoutube && (
              <button
                onClick={() => onDownload(selectedMedia, 'download')}
                className='py-2 px-4 bg-primary text-white rounded-md flex items-center gap-2'
              >
                <FiDownload className='w-4 h-4' />
                <span>Descargar</span>
              </button>
            )}

            {isYoutube && (
              <a
                href={`https://www.youtube.com/watch?v=${selectedMedia.youtubeId}`}
                target='_blank'
                rel='noopener noreferrer'
                className='py-2 px-4 bg-red-600 text-white rounded-md flex items-center gap-2'
              >
                <FaYoutube className='w-4 h-4' />
                <span>Ver en YouTube</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Vista móvil y tablets */}
      <div className='lg:hidden'>
        <MobileView />
      </div>

      {/* Vista desktop */}
      <div className='hidden lg:block'>
        <DesktopView />
      </div>

      {/* Modal para videos e imágenes */}
      {selectedMedia && <MediaViewerModal />}
    </>
  );
}
