'use client';

import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils/common-utils';

/**
 * Componente para mostrar un esqueleto (skeleton) durante la carga de métricas
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de mostrar un estado de carga
 */
export default function MetricCardSkeleton() {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='pt-6'>
        <div className='flex justify-between items-start'>
          <div className='w-full'>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-8 w-16 bg-gray-300 rounded mt-2 animate-pulse'></div>
            <div className='flex items-center mt-2'>
              <div className='h-3 w-3 bg-gray-200 rounded-full animate-pulse'></div>
              <div className='h-3 w-20 bg-gray-200 rounded ml-1 animate-pulse'></div>
            </div>
          </div>
          <div className='p-3 rounded-full bg-gray-200 animate-pulse'>
            <div className='h-5 w-5'></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
