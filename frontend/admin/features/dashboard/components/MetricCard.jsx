'use client';

import { Card, CardContent } from '@/shared/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils/common-utils';
import {
  getTextColorClass,
  getBackgroundColorClass
} from '@/shared/lib/utils/color-utils';

/**
 * Componente para mostrar una métrica con su valor y tendencia
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de mostrar un dato métrico
 * y el principio de Abierto/Cerrado (OCP) permitiendo personalización con distintos iconos y colores
 */
export default function MetricCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'primary',
  link
}) {
  // Determinar el icono y color de la tendencia
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className='h-3 w-3 text-green-500' />;
      case 'down':
        return <TrendingDown className='h-3 w-3 text-red-500' />;
      default:
        return <Minus className='h-3 w-3 text-gray-500' />;
    }
  };

  // Determinar el color del texto de cambio
  const getChangeColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const cardContent = (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='pt-6'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-sm font-medium text-gray-500'>{title}</p>
            <h3 className='text-2xl font-bold mt-1'>{value}</h3>
            <div className='flex items-center mt-1'>
              {getTrendIcon()}
              <span className={`text-xs font-medium ml-1 ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          </div>
          <div
            className={cn('p-3 rounded-full', getBackgroundColorClass(color))}
          >
            <Icon className={cn('h-5 w-5', getTextColorClass(color))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Si hay un enlace, envolver el contenido en un Link
  if (link) {
    return (
      <Link href={link} className='block'>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
