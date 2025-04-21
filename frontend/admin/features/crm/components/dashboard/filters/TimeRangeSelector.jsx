import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

/**
 * Componente para seleccionar un rango de tiempo
 * @param {string} timeRange - Rango de tiempo actual
 * @param {Function} onTimeRangeChange - Función para cambiar el rango de tiempo
 */
export const TimeRangeSelector = ({ timeRange, onTimeRangeChange }) => {
  return (
    <div className='w-full sm:w-auto'>
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className='w-full sm:w-[180px]'>
          <SelectValue placeholder='Periodo' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='7days'>Últimos 7 días</SelectItem>
          <SelectItem value='30days'>Últimos 30 días</SelectItem>
          <SelectItem value='90days'>Últimos 90 días</SelectItem>
          <SelectItem value='year'>Este año</SelectItem>
          <SelectItem value='all'>Todo el tiempo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
