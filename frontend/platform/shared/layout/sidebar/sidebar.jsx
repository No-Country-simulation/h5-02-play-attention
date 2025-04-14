'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../../ui/langage-selector';
import { Link } from '@/i18n/routing';
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

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const t = useTranslations('sidebar');
  const commonT = useTranslations('common');

  const menuItems = [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    {
      name: t('educationalMaterial'),
      icon: FileText,
      path: '/educational-material'
    },
    { name: t('tutorials'), icon: Video, path: '/tutorials' },
    { name: t('medicalArticles'), icon: BookOpen, path: '/medical-articles' },
    { name: t('demoVideos'), icon: Video, path: '/demo-videos' },
    { name: t('marketingMaterial'), icon: Images, path: '/marketing-material' },
    { name: t('activities'), icon: PenTool, path: '/activities' },
    { name: t('support'), icon: MessageCircle, path: '/support' },
    { name: t('settings'), icon: Settings, path: '/settings' }
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
            <h1 className='text-white text-xl font-bold'>
              {commonT('appName')}
            </h1>
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

        {/* Language switcher at bottom */}
        <div className='p-4 border-t border-gray-800'>
          {expanded ? (
            <div className='flex justify-between items-center'>
              <span className='text-gray-400 text-sm'>{t('language')}</span>
              <LanguageSwitcher />
            </div>
          ) : (
            <div className='flex justify-center'>
              <LanguageSwitcher />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
