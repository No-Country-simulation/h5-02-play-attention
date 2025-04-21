'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { menuItems, appVersion } from './lib/config/sidebarData';
import { isItemActive } from './lib/utils/sidebarUtils';
import SidebarItem from './components/SidebarItem';
import SidebarLogo from './components/SidebarLogo';

/**
 * Componente Sidebar que sigue el principio de Responsabilidad Única (SRP)
 * Se encarga únicamente de la navegación lateral y su estado (expandido/colapsado)
 */
export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  // Estado para controlar qué secciones están expandidas
  const [expandedSections, setExpandedSections] = useState({
    principal: true,
    crm_destacado: true,
    contenido: true,
    soporte: true,
    administracion: true,
    otros: true
  });

  // Agrupar elementos del menú por categoría
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Orden de las categorías por relevancia y frecuencia de uso diario
  const categoryOrder = [
    'principal',
    'crm_destacado',
    'administracion',
    'contenido',
    'soporte',
    'otros'
  ];

  // Determinar si una categoría debe mostrarse como sección desplegable
  const isSectionCollapsible = category => {
    return category !== 'principal' && category !== 'crm_destacado';
  };

  // Alternar sección expandida/colapsada
  const toggleSection = section => {
    if (!expanded) return; // Si el sidebar está colapsado, no hacer nada

    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div
      className={`h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-sidebar-border/30 ${
        expanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className='flex flex-col h-full'>
        {/* Logo and toggle */}
        <div className='flex items-center justify-between py-4 px-4 border-b border-sidebar-border/30 bg-sidebar/95 backdrop-blur-sm'>
          <div className='flex flex-col'>
            <SidebarLogo expanded={expanded} />
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className='p-1.5 rounded-full hover:bg-sidebar-border/30 transition-colors duration-200'
            aria-label={expanded ? 'Colapsar menú' : 'Expandir menú'}
          >
            {expanded ? (
              <ChevronLeft className='h-5 w-5 text-sidebar-foreground/70' />
            ) : (
              <ChevronRight className='h-5 w-5 text-sidebar-foreground/70' />
            )}
          </button>
        </div>

        {/* Navigation menu */}
        <nav className='flex-1 overflow-y-auto py-4 scrollbar-thin'>
          <div className='space-y-1 px-2'>
            {categoryOrder.map(category => {
              const items = groupedMenuItems[category];
              if (!items || items.length === 0) return null;

              // Para las categorías principales y CRM, mostrar sin título de sección
              if (category === 'principal' || category === 'crm_destacado') {
                return (
                  <div
                    key={category}
                    className={`space-y-0.5 ${
                      category === 'crm_destacado' ? 'mt-4 mb-4' : 'mb-2'
                    }`}
                  >
                    {category === 'crm_destacado' && expanded && (
                      <div className='px-3 mb-1.5'>
                        <div className='h-px w-full bg-sidebar-accent/40 mb-2'></div>
                      </div>
                    )}
                    <ul className='space-y-0.5'>
                      {items.map(item => (
                        <SidebarItem
                          key={item.name}
                          item={item}
                          active={isItemActive(item.path, pathname)}
                          expanded={expanded}
                          highlighted={category === 'crm_destacado'}
                        />
                      ))}
                    </ul>
                    {category === 'crm_destacado' && expanded && (
                      <div className='px-3 mt-1.5'>
                        <div className='h-px w-full bg-sidebar-accent/40 mt-2'></div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={category} className='space-y-0.5 mb-1'>
                  {expanded && (
                    <button
                      onClick={() => toggleSection(category)}
                      className='w-full flex items-center justify-between px-3 py-1.5 text-white/70 hover:text-white transition-colors'
                      style={{ filter: 'brightness(0.85) saturate(1.2)' }}
                    >
                      <h3 className='text-[11px] font-medium uppercase tracking-wider'>
                        {getCategoryTitle(category)}
                      </h3>
                      {expandedSections[category] ? (
                        <ChevronUp className='h-3 w-3 text-white/60' />
                      ) : (
                        <ChevronDown className='h-3 w-3 text-white/60' />
                      )}
                    </button>
                  )}

                  {/* Mostrar ítems solo si la sección está expandida o el sidebar colapsado */}
                  {(!expanded || expandedSections[category]) && (
                    <ul className='space-y-0.5'>
                      {items.map(item => (
                        <SidebarItem
                          key={item.name}
                          item={item}
                          active={isItemActive(item.path, pathname)}
                          expanded={expanded}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className='p-3 border-t border-sidebar-accent/30'>
          <div className='flex justify-center'>
            <span className='text-sidebar-accent/70 text-xs'>{appVersion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Función para obtener el título legible de cada categoría
function getCategoryTitle(category) {
  const titles = {
    principal: 'Principal',
    crm_destacado: 'CRM',
    contenido: 'Contenido',
    soporte: 'Soporte',
    administracion: 'Administración',
    otros: 'Otros'
  };
  return titles[category] || 'Otros';
}
