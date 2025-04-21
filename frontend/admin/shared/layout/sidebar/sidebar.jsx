'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    // Verificar inicialmente
    checkIfMobile();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkIfMobile);

    // Limpiar listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Cerrar el sidebar al cambiar de ruta en móviles
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [pathname, isMobile]);

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

  // Botón hamburguesa para móviles (se renderiza fuera del sidebar)
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className='fixed top-4 right-4 z-50 p-2 rounded-full bg-sidebar text-white md:hidden'
      aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
    >
      {isMobileOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
    </button>
  );

  return (
    <>
      {/* Botón de menú hamburguesa para móviles */}
      <MobileMenuButton />

      {/* Overlay para móviles */}
      {isMobile && isMobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-sidebar-border/30 z-50 
        ${isMobile && isMobileOpen ? 'w-full' : expanded ? 'w-64' : 'w-16'} 
        ${
          isMobile
            ? isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        }
        md:translate-x-0`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo and toggle */}
          <div className='flex items-center justify-between py-4 px-4 border-b border-sidebar-border/30 bg-sidebar/95 backdrop-blur-sm'>
            <div className='flex flex-col'>
              <SidebarLogo expanded={expanded || (isMobile && isMobileOpen)} />
            </div>
            {!isMobile && (
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
            )}
            {isMobile && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className='p-1.5 rounded-full hover:bg-sidebar-border/30 transition-colors duration-200'
                aria-label='Cerrar menú'
              >
                <X className='h-5 w-5 text-sidebar-foreground/70' />
              </button>
            )}
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
                      {category === 'crm_destacado' &&
                        (expanded || (isMobile && isMobileOpen)) && (
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
                            expanded={expanded || (isMobile && isMobileOpen)}
                            highlighted={category === 'crm_destacado'}
                            isMobile={isMobile}
                          />
                        ))}
                      </ul>
                      {category === 'crm_destacado' &&
                        (expanded || (isMobile && isMobileOpen)) && (
                          <div className='px-3 mt-1.5'>
                            <div className='h-px w-full bg-sidebar-accent/40 mt-2'></div>
                          </div>
                        )}
                    </div>
                  );
                }

                return (
                  <div key={category} className='space-y-0.5 mb-1'>
                    {(expanded || (isMobile && isMobileOpen)) && (
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
                    {((!expanded && !isMobile) ||
                      (isMobile && isMobileOpen) ||
                      expandedSections[category]) && (
                      <ul className='space-y-0.5'>
                        {items.map(item => (
                          <SidebarItem
                            key={item.name}
                            item={item}
                            active={isItemActive(item.path, pathname)}
                            expanded={expanded || (isMobile && isMobileOpen)}
                            isMobile={isMobile}
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
              <span className='text-sidebar-accent/70 text-xs'>
                {appVersion}
              </span>
            </div>
          </div>
        </div>
      </div>
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
