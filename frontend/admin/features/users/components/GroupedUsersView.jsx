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
 * Componente para mostrar usuarios agrupados por roles
 */
const GroupedUsersView = ({
  groupedUsers,
  updatingRoles,
  updatingStatuses,
  onEditUser,
  onRoleChange,
  onStatusChange
}) => {
  // Estado para manejar qué tarjetas están expandidas en vista móvil
  const [expandedRows, setExpandedRows] = useState({});

  // Función para expandir/colapsar tarjetas en móvil
  const toggleRow = userId => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

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

  // Componente de tarjeta para móvil
  const UserMobileCard = ({ user, groupTitle }) => (
    <div
      key={user.id}
      className='bg-white rounded-lg shadow-md overflow-hidden mb-3'
    >
      <div
        className='p-4 flex items-center justify-between cursor-pointer'
        onClick={() => toggleRow(user.id)}
      >
        <div>
          <h3 className='font-medium text-gray-900'>{user.name}</h3>
          <p className='text-sm text-gray-500'>{user.email}</p>
          <span className='text-xs text-purple-600 mt-1 block'>
            {groupTitle}
          </span>
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
              <label className='block text-xs text-gray-500 mb-1'>Rol</label>
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
              <label className='block text-xs text-gray-500 mb-1'>Estado</label>
              <div className='relative'>
                <Select
                  value={user.status}
                  onValueChange={value => onStatusChange(user.id, value)}
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
  );

  // Componente interno de grupo para reutilizar en ambos grupos
  const UserGroup = ({ users, title }) => (
    <div>
      <h2 className='text-lg font-semibold mb-3 text-purple-700 border-b pb-2'>
        {title}
      </h2>

      {/* Vista móvil y tablet */}
      <div className='lg:hidden'>
        {users.length > 0 ? (
          <div className='space-y-3'>
            {users.map(user => (
              <UserMobileCard key={user.id} user={user} groupTitle={title} />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-center py-4 bg-white shadow-md rounded-lg'>
            {title === 'Equipo de la empresa'
              ? 'No hay miembros del equipo para mostrar'
              : 'No hay usuarios/clientes para mostrar'}
          </p>
        )}
      </div>

      {/* Vista desktop */}
      <div className='hidden lg:block'>
        {users.length > 0 ? (
          <div className='overflow-x-auto'>
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
                {users.map(user => (
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
                          onValueChange={value =>
                            onStatusChange(user.id, value)
                          }
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-gray-500 text-center py-4 bg-white shadow-md rounded-lg'>
            {title === 'Equipo de la empresa'
              ? 'No hay miembros del equipo para mostrar'
              : 'No hay usuarios/clientes para mostrar'}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className='mb-6 space-y-6'>
      {/* Sección de equipo (Admin y Comercial) */}
      <UserGroup
        users={groupedUsers.teamMembers}
        title='Equipo de la empresa'
      />

      {/* Sección de clientes (User) */}
      <UserGroup users={groupedUsers.clients} title='Usuarios / Clientes' />
    </div>
  );
};

export default GroupedUsersView;
