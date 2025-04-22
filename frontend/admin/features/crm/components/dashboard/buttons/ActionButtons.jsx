import { Button } from '@/shared/ui/button';
import { CalendarIcon, Download } from 'lucide-react';

/**
 * Componente para agrupar los botones de acción del dashboard
 * @param {Function} onAddMeeting - Función para agendar reunión
 * @param {Function} onExport - Función para exportar a PDF
 */
export const ActionButtons = ({ onAddMeeting, onExport }) => {
  return (
    <div className='flex items-center gap-2 w-full sm:w-auto'>
      <Button
        onClick={onAddMeeting}
        variant='outline'
        size='sm'
        className='flex-1 sm:flex-none'
      >
        <CalendarIcon className='h-4 w-4 mr-2' />
        <span className='whitespace-nowrap'>Agendar</span>
      </Button>
      <Button
        onClick={onExport}
        variant='outline'
        size='sm'
        className='flex-1 sm:flex-none'
      >
        <Download className='h-4 w-4 mr-2' />
        <span className='whitespace-nowrap'>Exportar</span>
      </Button>
    </div>
  );
};
