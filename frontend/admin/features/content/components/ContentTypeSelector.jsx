'use client';

import { FileText, Video, FileType, FilePlus2 } from 'lucide-react';

/**
 * Componente que permite filtrar el contenido por su tipo
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de la selección de tipos
 * Aplica el principio de Abierto/Cerrado (OCP) permitiendo añadir nuevos tipos fácilmente
 */
export default function ContentTypeSelector({ selectedType, onTypeChange }) {
  // Lista de tipos de contenido disponibles
  const contentTypes = [
    { id: 'all', label: 'Todos', icon: FileText },
    { id: 'artículo', label: 'Artículos', icon: FileText },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'pdf', label: 'PDFs', icon: FileType },
    { id: 'presentación', label: 'Presentaciones', icon: FilePlus2 }
  ];

  return (
    <div className='flex flex-wrap gap-2'>
      {contentTypes.map(type => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;

        return (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-colors
              ${
                isSelected
                  ? 'bg-[#1c1c22] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <Icon
              className={`h-4 w-4 ${isSelected ? 'text-purple-500' : ''}`}
            />
            {type.label}
          </button>
        );
      })}
    </div>
  );
}
