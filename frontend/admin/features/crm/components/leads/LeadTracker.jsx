'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { leadStatusConfig } from '../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';

/**
 * Componente para mostrar estadísticas de leads agrupados por estado
 * Sigue SRP al encargarse solo de mostrar estadísticas de leads
 */
export default function LeadTracker({ leads = [], showDetailLink = false }) {
  // Estado para el tooltip
  const [tooltipInfo, setTooltipInfo] = useState(null);

  // Si no hay leads, mostrar mensaje
  if (!leads || leads.length === 0) {
    return (
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>Seguimiento de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            No hay leads disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  // Agrupar leads por estado
  const statusCounts = leads.reduce((acc, lead) => {
    const status = lead.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Calcular los totales para las barras de progreso
  const totalLeads = leads.length;

  // Ordenar los estados según la secuencia del embudo de ventas
  const statusOrder = [
    'nuevo',
    'contactado',
    'cualificado',
    'negociación',
    'convertido',
    'perdido',
    'inactivo'
  ];

  const sortedStatuses = Object.keys(statusCounts).sort((a, b) => {
    const indexA = statusOrder.indexOf(a);
    const indexB = statusOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  // Función para mostrar el tooltip con información del estado
  const showTooltip = (status, count, event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setTooltipInfo({
      status,
      count,
      percentage: Math.round((count / totalLeads) * 100),
      x: bounds.left + bounds.width / 2,
      y: bounds.top - 10
    });
  };

  // Función para ocultar el tooltip
  const hideTooltip = () => {
    setTooltipInfo(null);
  };

  return (
    <Card>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-center'>
          <CardTitle className='text-lg'>Seguimiento de Leads</CardTitle>
          {showDetailLink && (
            <Link
              href='/leads'
              className='text-sm text-blue-600 hover:underline'
            >
              Ver detalle
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Resumen total */}
          <div className='flex justify-between items-center'>
            <span className='text-sm text-muted-foreground'>
              Total de Leads
            </span>
            <span className='font-medium'>{totalLeads}</span>
          </div>

          {/* Barra de progreso por estado */}
          <div className='h-4 flex rounded-full overflow-hidden'>
            {sortedStatuses.map(status => {
              const count = statusCounts[status];
              const width = `${(count / totalLeads) * 100}%`;
              const config = leadStatusConfig[status] || {
                className: 'bg-gray-200',
                label: status
              };

              // Extraer solo el color de fondo de la clase
              let bgClass =
                config.className.split(' ').find(c => c.startsWith('bg-')) ||
                'bg-gray-200';

              return (
                <div
                  key={status}
                  className={cn(
                    bgClass,
                    'h-full cursor-pointer transition-all hover:brightness-90'
                  )}
                  style={{ width }}
                  onMouseEnter={e => showTooltip(status, count, e)}
                  onMouseLeave={hideTooltip}
                />
              );
            })}
          </div>

          {/* Leyenda de estados */}
          <div className='grid grid-cols-2 gap-2 pt-2'>
            {sortedStatuses.map(status => {
              const count = statusCounts[status];
              const config = leadStatusConfig[status] || {
                variant: 'outline',
                className: 'bg-neutral-light text-neutral border-neutral',
                label: status
              };

              return (
                <div key={status} className='flex items-center gap-2 text-sm'>
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      config.className
                        .split(' ')
                        .find(c => c.startsWith('bg-')) || 'bg-gray-200'
                    )}
                  />
                  <span>{config.label}:</span>
                  <span className='font-medium'>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tooltip */}
        {tooltipInfo && (
          <div
            className='absolute z-50 bg-black text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap'
            style={{
              left: `${tooltipInfo.x}px`,
              top: `${tooltipInfo.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {leadStatusConfig[tooltipInfo.status]?.label || tooltipInfo.status}:{' '}
            {tooltipInfo.count} ({tooltipInfo.percentage}%)
          </div>
        )}
      </CardContent>
    </Card>
  );
}
