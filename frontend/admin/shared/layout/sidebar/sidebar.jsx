'use client';

import { useState, useEffect } from 'react';
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
import SidebarMobile from './components/SidebarMobile';
import SidebarCollapseButton from '@/shared/layout/sidebar/components/SidebarCollapseButton';

/**
 * Componente Sidebar que sigue el principio de Responsabilidad Única (SRP)
 * Versión desktop únicamente, la versión móvil se maneja en SidebarMobile
 */
export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('');

  // Obtener el rol del usuario desde la cookie al cargar el componente
  useEffect(() => {
    // Leer la cookie user_info usando la API nativa
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='));

    if (userCookie) {
      try {
        const userInfo = JSON.parse(
          decodeURIComponent(userCookie.split('=')[1])
        );
        if (userInfo?.role) {
          setUserRole(userInfo.role);
        }
      } catch (error) {
        console.error('Error al leer la cookie user_info:', error);
      }
    }
  }, []);

  // Estado para controlar qué secciones están expandidas
  const [expandedSections, setExpandedSections] = useState({
    principal: true,
    crm_destacado: true,
    contenido: false,
    soporte: false,
    administracion: false,
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
    'soporte',
    'contenido',
    'otros'
  ];

  // Alternar sección expandida/colapsada
  const toggleSection = section => {
    if (!expanded) return; // Si el sidebar está colapsado, no hacer nada

    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filtrar las categorías según el rol del usuario
  const visibleCategories =
    userRole === 'Comercial'
      ? ['crm_destacado'] // Comercial solo ve CRM
      : categoryOrder; // Admin ve todo

  return (
    <>
      {/* Componente para móvil */}
      <SidebarMobile userRole={userRole} />

      {/* Sidebar para desktop */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full border-r border-sidebar-border bg-sidebar hidden md:flex flex-col ${
          expanded ? 'w-64' : 'w-[78px]'
        } transition-width duration-300 ease-in-out`}
      >
        {/* Logo del sidebar */}
        <div className='flex items-center justify-between h-16 border-b border-sidebar-border px-4'>
          <SidebarLogo expanded={expanded} />
          <SidebarCollapseButton
            expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          />
        </div>

        {/* Contenido del sidebar */}
        <div className='flex flex-col h-full'>
          {/* Navegación principal */}
          <nav className='flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-sidebar-accent/50 scrollbar-track-sidebar/20 hover:scrollbar-thumb-sidebar-accent/70'>
            <div className='space-y-1 px-2'>
              {visibleCategories.map(category => {
                const items = groupedMenuItems[category];
                if (!items || items.length === 0) return null;

                // Para las categorías principales, mostrar sin título de sección
                if (category === 'principal' || category === 'crm_destacado') {
                  return (
                    <div
                      key={category}
                      className={`space-y-1 ${
                        category === 'crm_destacado' ? 'mt-4 mb-4' : 'mb-2'
                      }`}
                    >
                      {category === 'crm_destacado' && (
                        <div className='px-3 mb-1.5'>
                          <div className='h-px w-full bg-sidebar-accent/40 mb-2'></div>
                        </div>
                      )}
                      <ul className='space-y-1'>
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
                      {category === 'crm_destacado' && (
                        <div className='px-3 mt-1.5'>
                          <div className='h-px w-full bg-sidebar-accent/40 mt-2'></div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Categorías con título y comportamiento collapsible
                return (
                  <div key={category} className='space-y-1 mb-2'>
                    {expanded && (
                      <button
                        onClick={() => toggleSection(category)}
                        className='w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-white/70 hover:text-white'
                      >
                        <h3>{getCategoryTitle(category)}</h3>
                        {expandedSections[category] ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                    )}
                    {(!expanded || expandedSections[category]) && (
                      <ul className='space-y-1'>
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

          {/* Footer del sidebar */}
          <div className='p-3 border-t border-sidebar-accent/30'>
            <div className='flex justify-center'>
              <span className='text-sidebar-accent/70 text-xs'>
                {appVersion}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Espaciador para mantener el contenido de la página correctamente posicionado */}
      <div
        className={`hidden md:block ${
          expanded ? 'ml-64' : 'ml-[78px]'
        } transition-[margin] duration-300 ease-in-out`}
      ></div>
    </>
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
