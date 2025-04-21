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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Estado para controlar la visibilidad en pantallas pequeñas
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // En móviles, iniciar con el sidebar cerrado
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        // En pantallas grandes, siempre expandido
        setExpanded(true);
      }
    };

    // Comprobar al inicio
    checkIfMobile();

    // Comprobar en cambios de tamaño de ventana
    window.addEventListener('resize', checkIfMobile);

    // Limpiar el listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Cerrar el sidebar móvil al cambiar de ruta
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
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

  // Botón hamburguesa móvil para la cabecera (solo visible cuando el menú está cerrado)
  const MobileMenuButton = () => (
    <button
      onClick={() => setMobileOpen(true)}
      className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-[#7c3aed] text-white shadow-lg'
      aria-label='Abrir menú'
    >
      <Menu className='h-5 w-5' />
    </button>
  );

  return (
    <>
      {/* Botón de hamburguesa en móvil (solo cuando está cerrado) */}
      {!mobileOpen && <MobileMenuButton />}

      {/* Overlay para cerrar el menú al hacer clic fuera (solo en móvil) */}
      {isMobile && mobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40'
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`h-screen bg-[#4c1d95] text-white transition-all duration-300 ease-in-out border-r border-[#7c3aed]/30 fixed z-40 md:relative
          ${expanded && !isMobile ? 'w-64' : isMobile ? 'w-full' : 'w-16'}
          ${
            isMobile
              ? mobileOpen
                ? 'translate-x-0'
                : '-translate-x-full'
              : 'translate-x-0'
          }
        `}
      >
        <div className='flex flex-col h-full'>
          {/* Logo and toggle */}
          <div className='flex items-center justify-between py-4 px-4 border-b border-[#7c3aed]/30 bg-[#4c1d95]/95 backdrop-blur-sm'>
            <div className='flex flex-col'>
              <SidebarLogo expanded={expanded || (isMobile && mobileOpen)} />
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className='p-1.5 rounded-full hover:bg-[#6d28d9]/30 transition-colors duration-200 hidden md:block'
              aria-label={expanded ? 'Colapsar menú' : 'Expandir menú'}
            >
              {expanded ? (
                <ChevronLeft className='h-5 w-5 text-white/70' />
              ) : (
                <ChevronRight className='h-5 w-5 text-white/70' />
              )}
            </button>
            {/* Botón para cerrar en móvil */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(false)}
                className='p-1.5 rounded-full hover:bg-[#6d28d9]/30 transition-colors duration-200 md:hidden'
                aria-label='Cerrar menú'
              >
                <X className='h-5 w-5 text-white/70' />
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
                        (expanded || (isMobile && mobileOpen)) && (
                          <div className='px-3 mb-1.5'>
                            <div className='h-px w-full bg-[#8b5cf6]/40 mb-2'></div>
                          </div>
                        )}
                      <ul className='space-y-0.5'>
                        {items.map(item => (
                          <SidebarItem
                            key={item.name}
                            item={item}
                            active={isItemActive(item.path, pathname)}
                            expanded={expanded || (isMobile && mobileOpen)}
                            highlighted={category === 'crm_destacado'}
                          />
                        ))}
                      </ul>
                      {category === 'crm_destacado' &&
                        (expanded || (isMobile && mobileOpen)) && (
                          <div className='px-3 mt-1.5'>
                            <div className='h-px w-full bg-[#8b5cf6]/40 mt-2'></div>
                          </div>
                        )}
                    </div>
                  );
                }

                return (
                  <div key={category} className='space-y-0.5 mb-1'>
                    {(expanded || (isMobile && mobileOpen)) && (
                      <button
                        onClick={() => toggleSection(category)}
                        className='w-full flex items-center justify-between px-3 py-1.5 text-white/70 hover:text-white transition-colors'
                      >
                        <h3 className='text-[12px] font-semibold uppercase tracking-wide'>
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
                      expandedSections[category] ||
                      (isMobile && mobileOpen)) && (
                      <ul className='space-y-0.5'>
                        {items.map(item => (
                          <SidebarItem
                            key={item.name}
                            item={item}
                            active={isItemActive(item.path, pathname)}
                            expanded={expanded || (isMobile && mobileOpen)}
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
          <div className='p-3 border-t border-[#7c3aed]/30'>
            <div className='flex justify-center'>
              <span className='text-[#c4b5fd]/70 text-[11px] font-normal'>
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
