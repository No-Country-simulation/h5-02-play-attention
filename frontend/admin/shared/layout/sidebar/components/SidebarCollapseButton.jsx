'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente para el botón de colapsar/expandir el sidebar
 * Sigue el principio de Responsabilidad Única (SRP)
 */
export default function SidebarCollapseButton({ expanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className='p-1.5 rounded-lg bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-accent transition-colors'
      aria-label={expanded ? 'Colapsar menú' : 'Expandir menú'}
    >
      {expanded ? (
        <ChevronLeft className='h-4 w-4' />
      ) : (
        <ChevronRight className='h-4 w-4' />
      )}
    </button>
  );
}
