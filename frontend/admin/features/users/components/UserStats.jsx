'use client';

import { Users, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react';

/**
 * Componente para mostrar estadísticas de usuarios
 * Mantiene la separación de responsabilidades mostrando solo datos relevantes
 * a la gestión de usuarios y sus estados
 */
export default function UserStats({ stats }) {
  const { total, active, inactive, pending, newThisMonth } = stats;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 mt-2'>
      {/* Total de usuarios */}
      <div className='bg-white p-3 rounded-lg shadow-sm flex items-start border border-gray-100'>
        <div className='mr-3 bg-indigo-100 p-2 rounded-lg'>
          <Users className='h-5 w-5 text-indigo-600' />
        </div>
        <div>
          <p className='text-xs text-gray-500'>Total Usuarios</p>
          <p className='text-xl font-bold'>{total}</p>
        </div>
      </div>

      {/* Usuarios activos */}
      <div className='bg-white p-3 rounded-lg shadow-sm flex items-start border border-gray-100'>
        <div className='mr-3 bg-green-100 p-2 rounded-lg'>
          <UserCheck className='h-5 w-5 text-green-600' />
        </div>
        <div>
          <p className='text-xs text-gray-500'>Usuarios Activos</p>
          <p className='text-xl font-bold'>{active}</p>
          <p className='text-xs text-gray-500'>
            {Math.round((active / total) * 100)}% del total
          </p>
        </div>
      </div>

      {/* Usuarios inactivos */}
      <div className='bg-white p-3 rounded-lg shadow-sm flex items-start border border-gray-100'>
        <div className='mr-3 bg-red-100 p-2 rounded-lg'>
          <UserX className='h-5 w-5 text-red-600' />
        </div>
        <div>
          <p className='text-xs text-gray-500'>Usuarios Inactivos</p>
          <p className='text-xl font-bold'>{inactive}</p>
          <p className='text-xs text-gray-500'>
            {Math.round((inactive / total) * 100)}% del total
          </p>
        </div>
      </div>

      {/* Usuarios pendientes */}
      <div className='bg-white p-3 rounded-lg shadow-sm flex items-start border border-gray-100'>
        <div className='mr-3 bg-orange-100 p-2 rounded-lg'>
          <Clock className='h-5 w-5 text-orange-600' />
        </div>
        <div>
          <p className='text-xs text-gray-500'>Pendientes</p>
          <p className='text-xl font-bold'>{pending}</p>
          <p className='text-xs text-gray-500'>
            {Math.round((pending / total) * 100)}% del total
          </p>
        </div>
      </div>

      {/* Nuevos este mes */}
      <div className='bg-white p-3 rounded-lg shadow-sm flex items-start border border-gray-100'>
        <div className='mr-3 bg-blue-100 p-2 rounded-lg'>
          <TrendingUp className='h-5 w-5 text-blue-600' />
        </div>
        <div>
          <p className='text-xs text-gray-500'>Nuevos este mes</p>
          <p className='text-xl font-bold'>{newThisMonth}</p>
          <p className='text-xs text-green-600'>
            +{Math.round((newThisMonth / (total - newThisMonth)) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
