'use client';

import { Card } from '@/shared/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils/common-utils';
import {
  getTextColorClass,
  getBackgroundColorClass
} from '@/shared/lib/utils/color-utils';

/**
 * Componente para mostrar tarjetas de acciones rápidas en el dashboard
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de una acción específica
 */
export default function ActionCard({
  title,
  description,
  icon: Icon,
  color = 'primary',
  link
}) {
  return (
    <Link href={link} className='block h-full'>
      <Card className='p-4 hover:shadow-md transition-shadow border cursor-pointer h-full flex flex-col'>
        <div className='flex items-center h-full'>
          <div
            className={cn(
              'p-3 rounded-full mr-4',
              getBackgroundColorClass(color)
            )}
          >
            <Icon className={cn('h-5 w-5', getTextColorClass(color))} />
          </div>

          <div className='flex-1'>
            <h3 className='font-medium'>{title}</h3>
            <p className='text-sm text-gray-500 mt-1'>{description}</p>
          </div>

          <ChevronRight className='h-5 w-5 text-gray-400' />
        </div>
      </Card>
    </Link>
  );
}
