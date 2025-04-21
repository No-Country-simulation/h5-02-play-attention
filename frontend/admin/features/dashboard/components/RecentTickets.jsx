'use client';

import { Card } from '@/shared/ui/card';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { recentTickets, formatRelativeTime } from '../lib';

/**
 * Componente para mostrar tickets recientes en el dashboard
 * Sigue el principio de Responsabilidad Única (SRP)
 */
export default function RecentTickets() {
  // Función para renderizar el icono según el estado del ticket
  const renderStatusIcon = status => {
    switch (status) {
      case 'abierto':
        return <AlertCircle className='h-4 w-4 text-red-500' />;
      case 'en proceso':
        return <Clock className='h-4 w-4 text-amber-500' />;
      case 'resuelto':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      default:
        return null;
    }
  };

  // Función para obtener la clase de borde según la prioridad
  const getPriorityBorderClass = priority => {
    switch (priority) {
      case 'alta':
        return 'border-red-500';
      case 'media':
        return 'border-amber-500';
      case 'baja':
        return 'border-blue-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <Card className='divide-y'>
      {recentTickets.map(ticket => (
        <Link
          key={ticket.id}
          href={`/tickets?id=${ticket.id}`}
          className='flex items-center p-4 hover:bg-gray-50 transition-colors'
        >
          <div
            className={`w-1 self-stretch mr-4 ${getPriorityBorderClass(
              ticket.priority
            )}`}
          />

          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              {renderStatusIcon(ticket.status)}
              <span className='text-xs font-medium capitalize text-gray-500'>
                {ticket.status}
              </span>
              <span className='text-xs text-gray-400 mx-1'>•</span>
              <span className='text-xs text-gray-400'>
                {formatRelativeTime(ticket.createdAt)}
              </span>
            </div>

            <h4 className='font-medium text-sm mt-1'>{ticket.subject}</h4>
            <p className='text-xs text-gray-500 mt-1'>De: {ticket.user.name}</p>
          </div>

          <div className='text-xs font-medium text-gray-600'>{ticket.id}</div>
        </Link>
      ))}

      <div className='p-4 text-center'>
        <Link
          href='/tickets'
          className='text-sm font-medium text-[#00ff99] hover:underline'
        >
          Ver todos los tickets
        </Link>
      </div>
    </Card>
  );
}
 