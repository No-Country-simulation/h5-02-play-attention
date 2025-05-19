'use client';

import { Card } from '@/shared/ui/card';
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  Video,
  FileType
} from 'lucide-react';
import Link from 'next/link';
import { contentActivities, formatRelativeTime } from '../lib';

/**
 * Componente para mostrar la actividad reciente relacionada con contenido
 * Sigue el principio de Responsabilidad Única (SRP)
 */
export default function ContentActivity() {
  // Función para renderizar el icono según el tipo de actividad
  const renderActivityIcon = type => {
    switch (type) {
      case 'create':
        return <PlusCircle className='h-4 w-4 text-green-500' />;
      case 'edit':
        return <Edit className='h-4 w-4 text-blue-500' />;
      case 'publish':
        return <Eye className='h-4 w-4 text-indigo-500' />;
      case 'delete':
        return <Trash2 className='h-4 w-4 text-red-500' />;
      default:
        return null;
    }
  };

  // Función para renderizar el icono según el tipo de contenido
  const renderContentTypeIcon = contentType => {
    switch (contentType) {
      case 'video':
        return <Video className='h-4 w-4 text-blue-500' />;
      case 'pdf':
        return <FileType className='h-4 w-4 text-red-500' />;
      case 'article':
      default:
        return <FileText className='h-4 w-4 text-gray-500' />;
    }
  };

  // Función para obtener texto descriptivo de la actividad
  const getActivityText = activity => {
    switch (activity.type) {
      case 'create':
        return 'creó';
      case 'edit':
        return 'editó';
      case 'publish':
        return 'publicó';
      case 'delete':
        return 'eliminó';
      default:
        return 'modificó';
    }
  };

  return (
    <Card className='divide-y'>
      {contentActivities.map(activity => (
        <div key={activity.id} className='flex items-center p-4'>
          <div className='p-2 rounded-full bg-gray-100 mr-4'>
            {renderActivityIcon(activity.type)}
          </div>

          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              <span className='text-sm font-medium'>Admin</span>
              <span className='text-sm text-gray-600'>
                {getActivityText(activity)}
              </span>
              <div className='flex items-center ml-1'>
                {renderContentTypeIcon(activity.contentType)}
                <span className='text-xs text-gray-600 ml-1 capitalize'>
                  {activity.contentType}
                </span>
              </div>
            </div>

            <p className='font-medium text-sm mt-1'>
              {activity.type === 'delete' ? (
                activity.title
              ) : (
                <Link
                  href={`/content/edit/${activity.contentId}`}
                  className='hover:text-[#00ff99] transition-colors'
                >
                  {activity.title}
                </Link>
              )}
            </p>

            <p className='text-xs text-gray-500 mt-1'>
              {formatRelativeTime(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}

      <div className='p-4 text-center'>
        <Link
          href='/content'
          className='text-sm font-medium text-[#00ff99] hover:underline'
        >
          Ver todo el contenido
        </Link>
      </div>
    </Card>
  );
}
 