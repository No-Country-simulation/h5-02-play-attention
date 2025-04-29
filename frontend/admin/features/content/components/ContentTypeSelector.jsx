'use client';

import {
  FileText,
  Video,
  FileType,
  FilePlus2,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/**
 * Componente que permite filtrar el contenido por su tipo
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de la selección de tipos
 * Aplica el principio de Abierto/Cerrado (OCP) permitiendo añadir nuevos tipos fácilmente
 */
export default function ContentTypeSelector({ selectedType, onTypeChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lista de tipos de contenido disponibles
  const contentTypes = [
    { id: 'all', label: 'Todos', icon: FileText },
    { id: 'artículo', label: 'Artículos', icon: FileText },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'pdf', label: 'PDFs', icon: FileType },
    { id: 'presentación', label: 'Presentaciones', icon: FilePlus2 }
  ];

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Encontrar el tipo seleccionado
  const selectedTypeObj =
    contentTypes.find(type => type.id === selectedType) || contentTypes[0];
  const SelectedIcon = selectedTypeObj.icon;

  return (
    <>
      {/* Selector desplegable para móviles y tablets */}
      <div className='lg:hidden w-full' ref={dropdownRef}>
        <div className='relative'>
          <div
            className='w-full h-12 border border-gray-300 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:border-purple-300 bg-white'
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className='flex items-center'>
              <SelectedIcon className='h-5 w-5 mr-2 text-purple-500' />
              <span>{selectedTypeObj.label}</span>
            </div>
            <ChevronDown className='h-4 w-4 text-gray-500' />
          </div>

          {dropdownOpen && (
            <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg'>
              {contentTypes.map(type => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                  <div
                    key={type.id}
                    className={`px-3 py-3 cursor-pointer hover:bg-purple-100 flex items-center ${
                      isSelected ? 'bg-purple-100 text-purple-800' : ''
                    }`}
                    onClick={() => {
                      onTypeChange(type.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <Icon
                      className={`h-4 w-4 mr-2 ${
                        isSelected ? 'text-purple-500' : ''
                      }`}
                    />
                    {type.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Botones para pantallas grandes */}
      <div className='hidden lg:block overflow-x-auto pb-2 -mx-2 px-2'>
        <div className='flex gap-2 min-w-max'>
          {contentTypes.map(type => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
                  whitespace-nowrap transition-colors min-h-[40px]
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
                <span className='text-sm'>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
