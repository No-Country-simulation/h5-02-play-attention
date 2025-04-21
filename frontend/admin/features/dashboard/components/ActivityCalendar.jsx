'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Calendar, CalendarDays, Info } from 'lucide-react';

/**
 * Componente para mostrar un calendario de actividades recientes
 * Utiliza datos locales por ahora, podría conectarse a una API más adelante
 */
export default function ActivityCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [days, setDays] = useState([]);

  useEffect(() => {
    // Generar datos de actividad para los días del mes actual
    const date = new Date(selectedDate);
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const newDays = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const weekday = dayDate.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNumber = dayDate.getDate();

      // Generar un número aleatorio de actividades (0-5) para este ejemplo
      const activityCount = Math.floor(Math.random() * 6);

      newDays.push({
        date: dayDate,
        weekday,
        day: dayNumber,
        activityCount,
        isToday:
          new Date().getDate() === dayNumber &&
          new Date().getMonth() === month &&
          new Date().getFullYear() === year
      });
    }

    setDays(newDays);
  }, [selectedDate]);

  // Obtener el nombre del mes y año actuales
  const monthName = selectedDate.toLocaleDateString('es-ES', { month: 'long' });
  const yearNumber = selectedDate.getFullYear();

  // Función para cambiar el mes
  const changeMonth = increment => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  // Función para determinar el color de fondo según la cantidad de actividades
  const getActivityColor = count => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-100';
    if (count === 2) return 'bg-green-200';
    if (count === 3) return 'bg-green-300';
    if (count === 4) return 'bg-green-400';
    return 'bg-green-500';
  };

  return (
    <Card className='p-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <CalendarDays className='h-5 w-5 mr-2 text-gray-500' />
          <h3 className='font-medium'>Calendario de Actividad</h3>
        </div>
        <div className='flex items-center text-sm text-gray-500'>
          <Info className='h-4 w-4 mr-1' />
          <span>Actividad diaria</span>
        </div>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <h4 className='text-lg font-medium capitalize'>
          {monthName} {yearNumber}
        </h4>
        <div className='flex'>
          <button
            onClick={() => changeMonth(-1)}
            className='p-1 rounded hover:bg-gray-100'
          >
            &lt;
          </button>
          <button
            onClick={() => changeMonth(1)}
            className='p-1 rounded hover:bg-gray-100 ml-2'
          >
            &gt;
          </button>
        </div>
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {days.map((day, index) => (
          <div
            key={index}
            className={`aspect-square flex flex-col items-center justify-center rounded-md text-xs ${
              day.isToday ? 'border-2 border-[#00ff99]' : ''
            } ${getActivityColor(day.activityCount)}`}
          >
            <span className='text-gray-500 capitalize'>{day.weekday}</span>
            <span className='font-medium'>{day.day}</span>
            {day.activityCount > 0 && (
              <span className='text-[9px] text-gray-700 mt-1'>
                {day.activityCount} act
              </span>
            )}
          </div>
        ))}
      </div>

      <div className='flex justify-center mt-4'>
        <div className='flex items-center space-x-2'>
          <span className='w-3 h-3 bg-gray-100 rounded'></span>
          <span className='text-xs text-gray-500'>0</span>

          <span className='w-3 h-3 bg-green-100 rounded ml-2'></span>
          <span className='text-xs text-gray-500'>1</span>

          <span className='w-3 h-3 bg-green-200 rounded ml-2'></span>
          <span className='text-xs text-gray-500'>2</span>

          <span className='w-3 h-3 bg-green-300 rounded ml-2'></span>
          <span className='text-xs text-gray-500'>3+</span>
        </div>
      </div>
    </Card>
  );
}
 