'use client';

import { UserPlus, Clock, TicketCheck, FileText } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import Link from 'next/link';
import {
  getAlertTypeColor,
  getTextColorClass,
  getBackgroundColorClass,
  getBorderColorClass
} from '@/shared/lib/utils/color-utils';

/**
 * Componente para mostrar alertas y notificaciones en el dashboard
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de mostrar una alerta específica
 */
export default function AlertCard({
  title,
  description,
  type,
  actionText,
  actionUrl
}) {
  // Obtener el color semántico basado en el tipo de alerta
  const semanticColor = getAlertTypeColor(type);

  // Determinar el color y el icono según el tipo de alerta
  const getAlertStyles = () => {
    // Mapa de iconos con colores específicos por categoría
    const iconMap = {
      lead: <UserPlus className={`h-5 w-5 ${getTextColorClass('leads')}`} />,
      ticket: (
        <TicketCheck className={`h-5 w-5 ${getTextColorClass('tickets')}`} />
      ),
      content: (
        <FileText className={`h-5 w-5 ${getTextColorClass('content')}`} />
      ),
      event: <Clock className={`h-5 w-5 ${getTextColorClass('events')}`} />
    };

    return {
      icon: iconMap[type] || (
        <UserPlus className={`h-5 w-5 ${getTextColorClass('neutral')}`} />
      ),
      borderColor: getBorderColorClass(semanticColor),
      actionColor: `${getTextColorClass(semanticColor)} hover:opacity-80`
    };
  };

  const { icon, borderColor, actionColor } = getAlertStyles();

  return (
    <Card
      className={`border-l-4 ${borderColor} hover:shadow-md transition-all`}
    >
      <div className='p-4'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-medium'>{title}</h3>
            <p className='text-sm text-gray-500 mt-1'>{description}</p>
          </div>
          <div
            className={`p-2 rounded-full ${getBackgroundColorClass(
              semanticColor
            )}`}
          >
            {icon}
          </div>
        </div>

        {actionText && actionUrl && (
          <div className='mt-4'>
            <Link
              href={actionUrl}
              className={`text-sm font-medium ${actionColor}`}
            >
              {actionText}
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
