'use client';

import { CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Componente de filtros por estado para los usuarios
 */
const UserStatusFilters = ({ selectedStatus, onStatusChange }) => {
  return (
    <div className='mb-6 overflow-x-auto'>
      <div className='flex gap-2 min-w-max pb-1'>
        <button
          className={`px-3 py-2 lg:px-4 rounded-lg flex items-center gap-1 whitespace-nowrap ${
            selectedStatus === 'all'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100'
          }`}
          onClick={() => onStatusChange('all')}
        >
          <span className='text-xs lg:text-sm'>Todos</span>
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-2 lg:px-4 rounded-lg whitespace-nowrap ${
            selectedStatus === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100'
          }`}
          onClick={() => onStatusChange('active')}
        >
          <CheckCircle className='h-3 w-3 lg:h-4 lg:w-4' />
          <span className='text-xs lg:text-sm'>Activos</span>
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-2 lg:px-4 rounded-lg whitespace-nowrap ${
            selectedStatus === 'inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100'
          }`}
          onClick={() => onStatusChange('inactive')}
        >
          <XCircle className='h-3 w-3 lg:h-4 lg:w-4' />
          <span className='text-xs lg:text-sm'>Inactivos</span>
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-2 lg:px-4 rounded-lg whitespace-nowrap ${
            selectedStatus === 'pending'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-gray-100'
          }`}
          onClick={() => onStatusChange('pending')}
        >
          <Clock className='h-3 w-3 lg:h-4 lg:w-4' />
          <span className='text-xs lg:text-sm'>Pendientes</span>
        </button>
      </div>
    </div>
  );
};

export default UserStatusFilters;
