'use client';

import { Edit, ChevronDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { ROLES_USUARIO, ESTADOS_USUARIO } from '../lib/hooks';
import { useState } from 'react';

/**
 * Componente de tabla de usuarios
 * Se encarga solo de renderizar la tabla y manejar interacciones básicas
 */
const UserTable = ({
  users,
  updatingRoles,
  updatingStatuses,
  onEditUser,
  onRoleChange,
  onStatusChange
}) => {
  // Obtener clases para el select de estado
  const getStatusSelectClass = status => {
    if (status === 'active') {
      return 'border-green-500 text-green-700 bg-green-50';
    }
    if (status === 'inactive') {
      return 'border-red-500 text-red-700 bg-red-50';
    }
    return '';
  };

  // Estado para manejar qué tarjetas están expandidas en vista móvil
  const [expandedRows, setExpandedRows] = useState({});

  // Función para expandir/colapsar tarjetas en móvil
  const toggleRow = userId => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className='mb-6'>
      {/* Vista de tarjetas para móviles y tablets */}
      <div className='lg:hidden space-y-4'>
        {users.length > 0 ? (
          users.map(user => (
            <div
              key={user.id}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              <div
                className='p-4 flex items-center justify-between cursor-pointer'
                onClick={() => toggleRow(user.id)}
              >
                <div>
                  <h3 className='font-medium text-gray-900'>{user.name}</h3>
                  <p className='text-sm text-gray-500'>{user.email}</p>
                </div>
                <div className='flex items-center'>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onEditUser(user);
                    }}
                    className='h-8 w-8 rounded-md flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors mr-2'
                  >
                    <Edit className='h-4 w-4 text-gray-600' />
                  </button>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedRows[user.id] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedRows[user.id] && (
                <div className='px-4 pb-4 border-t border-gray-100 pt-3'>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-xs text-gray-500 mb-1'>
                        Rol
                      </label>
                      <div className='relative'>
                        <Select
                          value={user.role}
                          onValueChange={value => onRoleChange(user.id, value)}
                          disabled={updatingRoles[user.id]}
                        >
                          <SelectTrigger
                            className='h-8 w-full px-2 text-xs border'
                            aria-label='Cambiar rol'
                          >
                            <SelectValue placeholder='Seleccionar rol' />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES_USUARIO.map(rol => (
                              <SelectItem key={rol.value} value={rol.value}>
                                {rol.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {updatingRoles[user.id] && (
                          <div className='absolute inset-0 flex items-center justify-center bg-white/80'>
                            <div className='animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent'></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className='block text-xs text-gray-500 mb-1'>
                        Estado
                      </label>
                      <div className='relative'>
                        <Select
                          value={user.status}
                          onValueChange={value =>
                            onStatusChange(user.id, value)
                          }
                          disabled={updatingStatuses[user.id]}
                        >
                          <SelectTrigger
                            className={`h-8 w-full px-2 text-xs border capitalize ${getStatusSelectClass(
                              user.status
                            )}`}
                            aria-label='Cambiar estado'
                          >
                            <SelectValue placeholder='Seleccionar estado' />
                          </SelectTrigger>
                          <SelectContent>
                            {ESTADOS_USUARIO.map(estado => (
                              <SelectItem
                                key={estado.value}
                                value={estado.value}
                                className={`capitalize ${
                                  estado.value === 'active'
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                }`}
                              >
                                {estado.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {updatingStatuses[user.id] && (
                          <div className='absolute inset-0 flex items-center justify-center bg-white/80'>
                            <div className='animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent'></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='mt-3 pt-3 border-t border-gray-100'>
                    <p className='text-xs text-gray-500'>
                      Creado: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <p className='text-gray-500'>No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Vista de tabla solo para desktop */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='min-w-full bg-white shadow-md rounded-lg'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Usuario
              </th>
              <th className='py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Rol
              </th>
              <th className='py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Estado
              </th>
              <th className='py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Creado
              </th>
              <th className='py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} className='hover:bg-gray-50'>
                  <td className='py-4 px-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='ml-2'>
                        <div className='text-sm font-medium text-gray-900'>
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>{user.email}</div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap'>
                    <div className='relative'>
                      <Select
                        value={user.role}
                        onValueChange={value => onRoleChange(user.id, value)}
                        disabled={updatingRoles[user.id]}
                      >
                        <SelectTrigger
                          className='h-8 px-2 text-xs sm:text-sm border'
                          aria-label='Cambiar rol'
                        >
                          <SelectValue placeholder='Seleccionar rol' />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES_USUARIO.map(rol => (
                            <SelectItem key={rol.value} value={rol.value}>
                              {rol.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingRoles[user.id] && (
                        <div className='absolute inset-0 flex items-center justify-center bg-white/80'>
                          <div className='animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent'></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap'>
                    <div className='relative'>
                      <Select
                        value={user.status}
                        onValueChange={value => onStatusChange(user.id, value)}
                        disabled={updatingStatuses[user.id]}
                      >
                        <SelectTrigger
                          className={`h-8 px-2 text-xs sm:text-sm border capitalize ${getStatusSelectClass(
                            user.status
                          )}`}
                          aria-label='Cambiar estado'
                        >
                          <SelectValue placeholder='Seleccionar estado' />
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADOS_USUARIO.map(estado => (
                            <SelectItem
                              key={estado.value}
                              value={estado.value}
                              className={`capitalize ${
                                estado.value === 'active'
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingStatuses[user.id] && (
                        <div className='absolute inset-0 flex items-center justify-center bg-white/80'>
                          <div className='animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent'></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex justify-center'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onEditUser(user)}
                              className='h-8 w-8 rounded-md flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors'
                            >
                              <Edit className='h-4 w-4 text-gray-600' />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar usuario</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='py-4 px-4 text-center text-gray-500'>
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
