'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, ChevronUp, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLogout } from '@/features/auth/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Video,
  BookOpen,
  PenTool,
  MessageCircle,
  Settings,
  User,
  HelpCircle,
  Bell,
  LogOut
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';

/**
 * Componente SidebarMobile que utiliza Sheet para crear un menú hamburguesa
 * adaptado a dispositivos móviles
 */
export default function SidebarMobile() {
  const [open, setOpen] = useState(false);
  const [showContentItems, setShowContentItems] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);
  const logout = useLogout();
  const sidebarRef = useRef(null);

  // Obtener los datos del usuario desde la cookie
  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='));

    if (userCookie) {
      try {
        const userInfo = JSON.parse(
          decodeURIComponent(userCookie.split('=')[1])
        );
        setUserData(userInfo);
      } catch (error) {
        console.error('Error al leer la cookie user_info:', error);
      }
    }
  }, []);

  // Orden de los items principales
  const mainItems = [
    { name: 'Panel de control', icon: LayoutDashboard, path: '/dashboard' },
    /* { name: 'Actividades', icon: PenTool, path: '/activities' }, */
    { name: 'Soporte', icon: MessageCircle, path: '/support' },
   /*  { name: 'Configuración', icon: Settings, path: '/settings' } */
  ];

  // Items de contenido que se mostrarán/ocultarán
  const contentItems = [
    {
      name: 'Material educativo',
      icon: FileText,
      path: '/educational-material'
    },
    { name: 'Tutoriales', icon: Video, path: '/tutorials' },
    { name: 'Artículos médicos', icon: BookOpen, path: '/medical-articles' },
    { name: 'Videos de demostración', icon: Video, path: '/demo-videos' }
  ];

  // Efecto para bloquear la interacción con el sidebar cuando el menú de usuario está abierto
  useEffect(() => {
    if (isUserMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (sidebarRef.current) {
        sidebarRef.current.style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = '';
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
            className='fixed top-4 left-4 z-50 p-2.5 rounded-full bg-primary shadow-md text-white hover:bg-primary/80 transition-colors'
            aria-label='Abrir menú'
            disabled={isUserMenuOpen}
          >
            <Menu className='h-6 w-6' />
          </button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='p-0 w-full bg-primary text-white border-r border-primary/20'
          ref={sidebarRef}
        >
          <div className='flex flex-col h-full'>
            {/* Header con logo */}
            <div className='flex items-center justify-center py-4 px-4 border-b border-white/10'>
              <Image
                src='/svgs/logos/logo.svg'
                width={200}
                height={48}
                className='w-fit h-10'
                alt='Logo'
              />
            </div>

            {/* Navigation menu */}
            <nav className='flex-1 overflow-y-auto py-4 scrollbar-thin'>
              <div className='space-y-1 px-2'>
                {/* Panel de control (primer item principal) */}
                <div className='py-1'>
                  <Link href='/dashboard' className='w-full'>
                    <button className='flex items-center w-full p-3 rounded-md hover:bg-white/10 transition-colors'>
                      <LayoutDashboard className='w-5 h-5 mr-3 text-white' />
                      <span className='text-sm font-medium text-white'>
                        Panel de control
                      </span>
                    </button>
                  </Link>
                </div>

                {/* Sección de Contenido (expandible) */}
                <div className='py-1'>
                  <div
                    onClick={() => setShowContentItems(!showContentItems)}
                    className='w-full cursor-pointer'
                  >
                    <button className='flex items-center justify-between w-full p-3 rounded-md hover:bg-white/10 transition-colors'>
                      <div className='flex items-center'>
                        <Newspaper className='w-5 h-5 mr-3 text-white' />
                        <span className='text-sm font-medium text-white'>
                          Contenido
                        </span>
                      </div>
                      {showContentItems ? (
                        <ChevronUp className='h-4 w-4 text-white' />
                      ) : (
                        <ChevronDown className='h-4 w-4 text-white' />
                      )}
                    </button>
                  </div>

                  {/* Items de contenido (aparecen/desaparecen) */}
                  {showContentItems && (
                    <div className='pl-4 mt-1 space-y-1'>
                      {contentItems.map((item, index) => (
                        <Link
                          key={`content-${index}`}
                          href={item.path}
                          className='w-full'
                        >
                          <button className='flex items-center w-full p-2 rounded-md hover:bg-white/10 transition-colors'>
                            <item.icon className='w-4 h-4 mr-3 text-white/70' />
                            <span className='text-sm text-white'>
                              {item.name}
                            </span>
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resto de items principales */}
                {mainItems.slice(1).map((item, index) => (
                  <div key={`main-${index}`} className='py-1'>
                    <Link href={item.path} className='w-full'>
                      <button className='flex items-center w-full p-3 rounded-md hover:bg-white/10 transition-colors'>
                        <item.icon className='w-5 h-5 mr-3 text-white' />
                        <span className='text-sm font-medium text-white'>
                          {item.name}
                        </span>
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </nav>

            {/* Footer con botón de perfil de usuario */}
            {userData && (
              <div className='border-t border-white/10 p-3'>
                <div className='flex justify-between items-center'>
                  <button
                    onClick={handleOpenUserMenu}
                    className='flex items-center space-x-2 p-2 rounded-md hover:bg-white/10 transition-colors w-full'
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
                  <span className='text-xs text-white/50'>v1.0.0</span>
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
            className={`bg-primary w-full max-w-md rounded-t-xl p-5 text-white
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
            <div className='flex items-center justify-between mb-4 border-b border-white/10 pb-4'>
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
                className='p-1 rounded-full hover:bg-white/10'
                aria-label='Cerrar menú'
              >
                <X className='h-6 w-6 text-white' />
              </button>
            </div>

            {/* Lista de opciones */}
            <div className='space-y-1'>
              <Link href="/profile" className='flex items-center w-full p-3 text-sm text-left hover:bg-white/10 rounded-md transition-colors text-white'>
                <User className='mr-3 h-5 w-5 text-white' />
                <span>Perfil</span>
              </Link>
              <button className='flex items-center w-full p-3 text-sm text-left hover:bg-white/10 rounded-md transition-colors text-white'>
                <Settings className='mr-3 h-5 w-5 text-white' />
                <span>Configuración</span>
              </button>
              <button className='flex items-center w-full p-3 text-sm text-left hover:bg-white/10 rounded-md transition-colors text-white'>
                <Bell className='mr-3 h-5 w-5 text-white' />
                <span>Notificaciones</span>
              </button>
              <button className='flex items-center w-full p-3 text-sm text-left hover:bg-white/10 rounded-md transition-colors text-white'>
                <HelpCircle className='mr-3 h-5 w-5 text-white' />
                <span>Ayuda</span>
              </button>
            </div>

            {/* Botón de cerrar sesión */}
            <div className='mt-4 pt-4 border-t border-white/10'>
              <button
                onClick={handleLogout}
                disabled={logout.isPending}
                className='flex items-center w-full p-3 text-sm text-left rounded-md transition-colors bg-white/10 hover:bg-white/20 text-white group'
              >
                <LogOut className='mr-3 h-5 w-5 text-white' />
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
