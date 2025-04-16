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
  const resourceCategories = [
    {
      title: 'Material Educativo',
      description:
        'Documentos, presentaciones y guías para usar Play Attention.',
      icon: FileText,
      path: '/educational-material',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Tutoriales',
      description: 'Videos paso a paso para la instalación y uso del sistema.',
      icon: Video,
      path: '/tutorials',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Artículos Médicos',
      description:
        'Contenido clínicamente validado sobre TDAH y mejora cognitiva.',
      icon: BookOpen,
      path: '/medical-articles',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Videos de Demostración',
      description: 'Demostraciones de ejercicios e historias de éxito.',
      icon: Video,
      path: '/demo-videos',
      color: 'bg-red-100 text-red-700'
    },
    {
      title: 'Material de Marketing',
      description: 'Banners, imágenes y folletos digitales para profesionales.',
      icon: Images,
      path: '/marketing-material',
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      title: 'Actividades',
      description:
        'Ejercicios interactivos complementarios para el entrenamiento cognitivo.',
      icon: PenTool,
      path: '/activities',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      title: 'Soporte',
      description:
        'Chat en vivo, tickets y formularios de contacto para asistencia.',
      icon: MessageCircle,
      path: '/support',
      color: 'bg-cyan-100 text-cyan-700'
    },
    {
      title: 'Configuración',
      description: 'Administra tu cuenta y preferencias.',
      icon: Settings,
      path: '/settings',
      color: 'bg-gray-100 text-gray-700'
    }
  ];

  return resourceCategories;
}
