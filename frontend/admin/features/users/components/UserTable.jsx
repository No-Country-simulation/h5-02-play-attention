'use client';

import { Edit } from 'lucide-react';
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

  return (
    <div className='overflow-x-auto mb-6'>
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
  );
};

export default UserTable;
