'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Video,
  BookOpen,
  Medal,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Images,
  PenTool
} from 'lucide-react';

/**
 * Componente de sidebar para la navegación principal
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isMobile - Indica si se está renderizando en el menú móvil
 * @returns {JSX.Element} Componente de React
 */
export default function Sidebar({ isMobile = false }) {
  const [expanded, setExpanded] = useState(!isMobile);

  const menuItems = [
    { name: 'Panel de control', icon: LayoutDashboard, path: '/dashboard' },
    {
      name: 'Material Educativo',
      icon: FileText,
      path: '/educational-material'
    },
    { name: 'Tutoriales', icon: Video, path: '/tutorials' },
    { name: 'Artículos Médicos', icon: BookOpen, path: '/medical-articles' },
    { name: 'Videos de Demostración', icon: Video, path: '/demo-videos' },
    {
      name: 'Material de Marketing',
      icon: Images,
      path: '/marketing-material'
    },
    { name: 'Actividades', icon: PenTool, path: '/activities' },
    { name: 'Soporte', icon: MessageCircle, path: '/support' },
    { name: 'Configuración', icon: Settings, path: '/settings' }
  ];

  return (
    <aside
      className={`${
        isMobile ? 'h-full' : 'h-screen sticky top-0 left-0'
      } bg-[#4a148c] transition-all duration-300 ${
        expanded ? 'w-64' : 'w-20'
      } ${isMobile ? 'w-full' : ''}`}
    >
      <div className='flex flex-col h-full'>
        {/* Logo and toggle */}
        <div className='flex items-center justify-between p-4 border-b border-purple-800'>
          {expanded ? (
            <div className='flex items-center'>
              <Image
                src='/svgs/logos/logologin.svg'
                alt='Play Attention Logo'
                width={120}
                height={40}
                priority
                className='h-8 w-auto'
              />
            </div>
          ) : (
            <div className='flex justify-center w-full'>
              <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>
                <span className='text-purple-900 font-bold text-sm'>PA</span>
              </div>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setExpanded(!expanded)}
              className='p-1 rounded-full hover:bg-purple-700 text-white'
            >
              {expanded ? (
                <ChevronLeft className='h-6 w-6' />
              ) : (
                <ChevronRight className='h-6 w-6' />
              )}
            </button>
          )}
        </div>

        {/* Navigation menu */}
        <nav className='flex-1 overflow-y-auto py-4'>
          <ul className='space-y-2 px-2'>
            {menuItems.map(item => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className='flex items-center p-2 text-white rounded-lg hover:bg-purple-700'
                >
                  {item.icon && (
                    <div className='w-6 h-6 mr-3 flex justify-center items-center'>
                      <item.icon className='h-5 w-5' />
                    </div>
                  )}
                  {(expanded || isMobile) && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
