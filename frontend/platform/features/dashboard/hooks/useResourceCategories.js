import { useTranslations } from 'next-intl';
import {
  FileText,
  Video,
  BookOpen,
  Images,
  PenTool,
  MessageCircle,
  Settings
} from 'lucide-react';

export function useResourceCategories() {
  const t = useTranslations('dashboard');

  const resourceCategories = [
    {
      title: t('educationalMaterial'),
      description: t('educationalMaterialDesc'),
      icon: FileText,
      path: '/educational-material',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: t('tutorials'),
      description: t('tutorialsDesc'),
      icon: Video,
      path: '/tutorials',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: t('medicalArticles'),
      description: t('medicalArticlesDesc'),
      icon: BookOpen,
      path: '/medical-articles',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: t('demoVideos'),
      description: t('demoVideosDesc'),
      icon: Video,
      path: '/demo-videos',
      color: 'bg-red-100 text-red-700'
    },
    {
      title: t('marketingMaterial'),
      description: t('marketingMaterialDesc'),
      icon: Images,
      path: '/marketing-material',
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      title: t('activities'),
      description: t('activitiesDesc'),
      icon: PenTool,
      path: '/activities',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      title: t('support'),
      description: t('supportDesc'),
      icon: MessageCircle,
      path: '/support',
      color: 'bg-cyan-100 text-cyan-700'
    },
    {
      title: t('settings'),
      description: t('settingsDesc'),
      icon: Settings,
      path: '/settings',
      color: 'bg-gray-100 text-gray-700'
    }
  ];

  return resourceCategories;
}
