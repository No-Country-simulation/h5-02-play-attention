'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Usuarios', icon: Users, path: '/users' },
    { name: 'Productos', icon: ShoppingBag, path: '/products' },
    { name: 'Configuración', icon: Settings, path: '/settings' }
  ];

  return (
    <div
      className={`h-screen bg-[#1c1c22] transition-all duration-300 ${
        expanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className='flex flex-col h-full'>
        {/* Logo and toggle */}
        <div className='flex items-center justify-between p-4 border-b border-gray-800'>
          {expanded && (
            <h1 className='text-white text-xl font-bold'>Admin Panel</h1>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className='p-1 rounded-full hover:bg-gray-700'
          >
            {expanded ? (
              <ChevronLeft className='h-6 w-6 text-white' />
            ) : (
              <ChevronRight className='h-6 w-6 text-white' />
            )}
          </button>
        </div>

        {/* Navigation menu */}
        <nav className='flex-1 overflow-y-auto py-4'>
          <ul className='space-y-2 px-2'>
            {menuItems.map(item => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className='flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700'
                >
                  {item.icon && (
                    <div className='w-6 h-6 mr-3 flex justify-center items-center'>
                      <item.icon className='h-5 w-5' />
                    </div>
                  )}
                  {expanded && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className='p-4 border-t border-gray-800'>
          <div className='flex justify-center'>
            <span className='text-gray-400 text-xs'>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
