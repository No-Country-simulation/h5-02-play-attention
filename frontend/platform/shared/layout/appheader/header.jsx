'use client';

import Link from 'next/link';
import Image from 'next/image';
import UserMenu from '@/features/auth/components/UserMenu';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import Sidebar from '@/shared/layout/sidebar/sidebar';
import { NotificationBell } from '@/shared/ui/notifications/NotificationBell';

/**
 * Componente de header para la aplicación
 * @returns {JSX.Element} Componente de React
 */
export default function AppHeader({ children }) {
  return (
    <header className='w-full bg-white border-b border-gray-200 h-16 px-4 sticky top-0 z-10'>
      <div className='flex h-full items-center justify-between'>
        <div className='flex items-center gap-2'>{children}</div>

        {/* Acciones del header */}
        <div className='flex items-center gap-2'>
          {/* Notificaciones */}
          <NotificationBell />

          <div className='hidden md:block'>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
