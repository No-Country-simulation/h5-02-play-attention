'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, X } from 'lucide-react';
import { menuItems, appVersion } from '../lib/config/sidebarData';
import { isItemActive } from '../lib/utils/sidebarUtils';
import SidebarItem from './SidebarItem';
import SidebarLogo from './SidebarLogo';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { useLogout } from '@/features/auth/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { User, Settings, LogOut, HelpCircle, Bell } from 'lucide-react';

/**
 * Componente SidebarMobile separado que utiliza Sheet para una mejor experiencia en móvil
 * Sigue el principio de Responsabilidad Única (SRP)
 */
export default function SidebarMobile({ userRole }) {
  const [open, setOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const [role, setRole] = useState(userRole || '');
  const [userData, setUserData] = useState(null);
  const logout = useLogout();
  const sidebarRef = useRef(null);

  // Obtener el rol y datos del usuario
  useEffect(() => {
    // Leer la cookie user_info
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='));

    if (userCookie) {
      try {
        const userInfo = JSON.parse(
          decodeURIComponent(userCookie.split('=')[1])
        );
        setUserData(userInfo);
        if (userInfo?.role && !userRole) {
          setRole(userInfo.role);
        }
      } catch (error) {
        console.error('Error al leer la cookie user_info:', error);
      }
    }
  }, [userRole]);

  // Efecto para bloquear la interacción con el sidebar cuando el menú de usuario está abierto
  useEffect(() => {
    // Bloquear el scroll del documento cuando el menú de usuario está abierto
    if (isUserMenuOpen) {
      document.body.style.overflow = 'hidden';

      // Agregar un event-blocker para el sidebar cuando el menú del usuario está abierto
      if (sidebarRef.current) {
        sidebarRef.current.style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = '';

      // Restaurar eventos del sidebar cuando el menú se cierra
      if (sidebarRef.current) {
        sidebarRef.current.style.pointerEvents = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (sidebarRef.current) {
        sidebarRef.current.style.pointerEvents = '';
      }
    };
  }, [isUserMenuOpen]);

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
    setIsUserMenuOpen(false);
    setIsClosing(false);
  }, [pathname]);

  // Observa cambios en el estado del sidebar para cerrar el menú de usuario
  useEffect(() => {
    if (!open && isUserMenuOpen) {
      closeUserMenu();
    }
  }, [open]);

  // Función para cerrar el menú de usuario con animación
  const closeUserMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsUserMenuOpen(false);
      setIsClosing(false);
    }, 300); // Duración de la animación
  };

  // Manejador para abrir el menú de usuario
  const handleOpenUserMenu = e => {
    e.stopPropagation();
    if (!isUserMenuOpen) {
      setIsUserMenuOpen(true);
    }
  };

  // Manejador para cerrar sesión
  const handleLogout = () => {
    closeUserMenu();
    setOpen(false);
    logout.mutate();
  };

  // Obtener iniciales para el avatar
  const getInitials = () => {
    if (!userData?.name)
      return userData?.email?.substring(0, 2).toUpperCase() || '?';
    return userData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Mostrar rol en formato legible
  const getRoleText = () => {
    if (!userData?.role) return '';
    return userData.role === 'Admin' ? 'Administrador' : userData.role;
  };

  return (
    <div className='md:hidden'>
      {/* Sidebar principal */}
      <Sheet
        open={open}
        onOpenChange={newOpen => {
          // Solo permitir cerrar el sidebar si el menú de usuario no está abierto
          if (isUserMenuOpen && !newOpen) {
            return;
          }
          setOpen(newOpen);
          if (!newOpen && isUserMenuOpen) {
            closeUserMenu();
          }
        }}
      >
        <SheetTrigger asChild>
          <button
            className='fixed top-4 right-4 z-50 p-2.5 rounded-full bg-sidebar shadow-md text-white hover:bg-sidebar-accent/80 transition-colors'
            aria-label='Abrir menú'
            disabled={isUserMenuOpen}
          >
            <Menu className='h-6 w-6' />
          </button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='p-0 w-full bg-sidebar text-sidebar-foreground'
          ref={sidebarRef}
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

            {/* Footer con botón de perfil de usuario */}
            {userData && (
              <div className='border-t border-sidebar-accent/30 p-3'>
                <div className='flex justify-between items-center'>
                  <button
                    onClick={handleOpenUserMenu}
                    className='flex items-center space-x-2 p-2 rounded-md hover:bg-sidebar-accent/20 transition-colors w-full'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${
                          userData.name || userData.email
                        }&background=6366f1&color=fff`}
                        alt={userData.name || userData.email}
                      />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col flex-1'>
                      <span className='text-sm font-medium text-white'>
                        {userData.name || userData.email}
                      </span>
                      <span className='text-xs text-white/70'>
                        {getRoleText()}
                      </span>
                    </div>
                    <ChevronDown className='h-4 w-4 text-white/70' />
                  </button>
                </div>

                <div className='flex justify-center mt-2'>
                  <span className='text-sidebar-accent/70 text-xs'>
                    {appVersion}
                  </span>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Modal de usuario que se abre desde abajo */}
      {isUserMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-[1000] flex items-end justify-center'
          onClick={closeUserMenu}
          onTouchEnd={closeUserMenu}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className={`bg-sidebar w-full max-w-md rounded-t-xl p-5 text-white
              ${
                isClosing
                  ? 'transform transition-transform duration-300 translate-y-full'
                  : 'transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom'
              }`}
            onClick={e => e.stopPropagation()}
            onTouchEnd={e => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
            {/* Cabecera con información del usuario y botón de cierre */}
            <div className='flex items-center justify-between mb-4 border-b border-sidebar-border/30 pb-4'>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${
                      userData?.name || userData?.email
                    }&background=6366f1&color=fff`}
                    alt={userData?.name || userData?.email}
                  />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-white'>
                    {userData?.name || userData?.email}
                  </p>
                  <p className='text-sm text-white/70'>{getRoleText()}</p>
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  closeUserMenu();
                }}
                className='p-1 rounded-full hover:bg-sidebar-accent/20 text-white'
                aria-label='Cerrar menú'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            {/* Lista de opciones */}
            <div className='space-y-1'>
              <button className='flex items-center w-full p-3 text-sm text-left hover:bg-sidebar-accent/20 rounded-md transition-colors text-white'>
                <User className='mr-3 h-5 w-5 text-sidebar-accent' />
                <span>Perfil</span>
              </button>
              <button className='flex items-center w-full p-3 text-sm text-left hover:bg-sidebar-accent/20 rounded-md transition-colors text-white'>
                <Settings className='mr-3 h-5 w-5 text-sidebar-accent' />
                <span>Configuración</span>
              </button>
              <button className='flex items-center w-full p-3 text-sm text-left hover:bg-sidebar-accent/20 rounded-md transition-colors text-white'>
                <Bell className='mr-3 h-5 w-5 text-sidebar-accent' />
                <span>Notificaciones</span>
              </button>
              <button className='flex items-center w-full p-3 text-sm text-left hover:bg-sidebar-accent/20 rounded-md transition-colors text-white'>
                <HelpCircle className='mr-3 h-5 w-5 text-sidebar-accent' />
                <span>Ayuda</span>
              </button>
            </div>

            {/* Botón de cerrar sesión */}
            <div className='mt-4 pt-4 border-t border-sidebar-border/30'>
              <button
                onClick={handleLogout}
                disabled={logout.isPending}
                className='flex items-center w-full p-3 text-sm text-left rounded-md transition-colors bg-sidebar-accent/30 hover:bg-sidebar-accent/50 text-white group'
              >
                <LogOut className='mr-3 h-5 w-5 text-white group-hover:text-white' />
                <span>
                  {logout.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
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
