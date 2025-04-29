'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { menuItems, appVersion } from '../lib/config/sidebarData';
import { isItemActive } from '../lib/utils/sidebarUtils';
import SidebarItem from './SidebarItem';
import SidebarLogo from './SidebarLogo';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';

/**
 * Componente SidebarMobile separado que utiliza Sheet para una mejor experiencia en móvil
 * Sigue el principio de Responsabilidad Única (SRP)
 */
export default function SidebarMobile({ userRole }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [role, setRole] = useState(userRole || '');

  // Obtener el rol del usuario si no se pasó como prop
  useEffect(() => {
    if (!userRole) {
      // Leer la cookie user_info
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_info='));

      if (userCookie) {
        try {
          const userInfo = JSON.parse(
            decodeURIComponent(userCookie.split('=')[1])
          );
          if (userInfo?.role) {
            setRole(userInfo.role);
          }
        } catch (error) {
          console.error('Error al leer la cookie user_info:', error);
        }
      }
    }
  }, [userRole]);

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

  // Filtrar las categorías según el rol del usuario
  const visibleCategories =
    role === 'Comercial'
      ? ['crm_destacado'] // Comercial solo ve CRM
      : categoryOrder; // Admin ve todo

  // Cerrar el sidebar al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className='md:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className='fixed top-4 right-4 z-50 p-2.5 rounded-full bg-sidebar shadow-md text-white hover:bg-sidebar-accent/80 transition-colors'
            aria-label='Abrir menú'
          >
            <Menu className='h-6 w-6' />
          </button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='p-0 w-full bg-sidebar text-sidebar-foreground'
        >
          <div className='flex flex-col h-full'>
            {/* Header con logo */}
            <div className='flex items-center justify-between py-4 px-4 border-b border-sidebar-border/30'>
              <SidebarLogo expanded={true} />
            </div>

            {/* Navigation menu */}
            <nav className='flex-1 overflow-y-auto py-4 scrollbar-thin'>
              <div className='space-y-1 px-2'>
                {visibleCategories.map(category => {
                  const items = groupedMenuItems[category];
                  if (!items || items.length === 0) return null;

                  // Para las categorías principales, mostrar sin título de sección
                  if (
                    category === 'principal' ||
                    category === 'crm_destacado'
                  ) {
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
                              expanded={true}
                              highlighted={category === 'crm_destacado'}
                              isMobile={true}
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

                  // Categorías con título
                  return (
                    <div key={category} className='space-y-1 mb-2'>
                      <div className='px-3 py-1.5'>
                        <h3 className='text-[11px] font-medium uppercase tracking-wider text-white/70'>
                          {getCategoryTitle(category)}
                        </h3>
                      </div>
                      <ul className='space-y-1'>
                        {items.map(item => (
                          <SidebarItem
                            key={item.name}
                            item={item}
                            active={isItemActive(item.path, pathname)}
                            expanded={true}
                            isMobile={true}
                          />
                        ))}
                      </ul>
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
        </SheetContent>
      </Sheet>
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
