import React, { useState } from 'react';
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileImage
} from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { FiDownload, FiEye } from 'react-icons/fi';

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
    default:
      return <FaFilePdf {...iconProps} className='text-gray-500' />;
  }
};

export function MaterialsTable({ materials, onDownload }) {
  const [selectedPDF, setSelectedPDF] = useState(null);

  const handleView = material => {
    if (material.type.toLowerCase() === 'pdf') {
      setSelectedPDF(material.url);
    } else {
      onDownload(material, 'view');
    }
  };

  // Vista para dispositivos móviles - tarjetas
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
              <button
                onClick={() => handleView(material)}
                className='flex-1 py-2 px-3 flex justify-center items-center gap-1 text-xs bg-primary text-white rounded-md'
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
                >
                  <FiDownload className='w-4 h-4' />
                </button>
                <button
                  onClick={() => handleView(material)}
                  className='inline-flex items-center px-6 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
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

  return (
    <>
      {/* Vista móvil */}
      <div className='md:hidden'>
        <MobileView />
      </div>

      {/* Vista desktop */}
      <div className='hidden md:block'>
        <DesktopView />
      </div>

      {/* Visor de PDF - común para ambas vistas */}
      {selectedPDF && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full max-w-5xl h-[80vh] flex flex-col'>
            <div className='flex justify-between items-center p-4 border-b'>
              <h3 className='font-medium'>Visualizador de PDF</h3>
              <button
                onClick={() => setSelectedPDF(null)}
                className='text-gray-500 hover:text-gray-700 text-xl'
              >
                ✕
              </button>
            </div>
            <div className='flex-1 w-full h-full'>
              <object
                data={selectedPDF}
                type='application/pdf'
                className='w-full h-full'
              >
                <div className='flex flex-col items-center justify-center p-8 text-center'>
                  <p className='text-red-500 mb-4'>
                    No se puede mostrar el PDF en el navegador
                  </p>
                  <a
                    href={selectedPDF}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='px-4 py-2 bg-primary text-white rounded'
                  >
                    Abrir en nueva pestaña
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
