'use client';

import Link from 'next/link';
import Image from 'next/image';
import UserMenu from '@/features/auth/components/UserMenu';
import { Bell, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import Sidebar from '@/shared/layout/sidebar/sidebar';

/**
 * Componente de header para la aplicación
 * @returns {JSX.Element} Componente de React
 */
export default function AppHeader() {
  return (
    <header className='w-full bg-white border-b border-gray-200 h-16 px-4 sticky top-0 z-10'>
      <div className='flex h-full items-center justify-between'>
        {/* Menú móvil y logo */}
        <div className='flex items-center gap-4'>
          {/* Menú móvil */}
          <Sheet>
            <SheetTrigger asChild>
              <button className='md:hidden p-2 rounded-md hover:bg-gray-100'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Menú</span>
              </button>
            </SheetTrigger>
            <SheetContent side='left' className='p-0'>
              <Sidebar isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Acciones del header */}
        <div className='flex items-center gap-2'>
          {/* Notificaciones */}
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <Bell className='h-5 w-5' />
            <span className='sr-only'>Notificaciones</span>
          </button>

          {/* Menú de usuario */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
