'use client';

import { useState } from 'react';
import {
  Search,
  PlusCircle,
  UserCog,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Pencil,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';
import UserStats from './components/UserStats';
import UserCreateModal from './components/UserCreateModal';
import UserEditModal from './components/UserEditModal';
import { Button } from '@/shared/ui/button';
import { generateUsersPDF } from './lib/adapters/pdf-adapter';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';
import { mockUsers, userStats } from './lib/config/mock-data';

/**
 * Componente principal de gestión de usuarios
 * Se enfoca exclusivamente en la administración de usuarios, sus datos y estados,
 * dejando la gestión de roles y permisos para su sección correspondiente
 */
export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { title, description } = getPageMetadata('users');

  // Estado para edición de usuario
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'Usuario'
  });

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Mismo tamaño que en CRM

  // Filtrar usuarios por término de búsqueda y estado
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Calcular datos de paginación
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Obtener usuarios para la página actual
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const currentPageUsers = getCurrentPageUsers();
  const currentUsersCount = currentPageUsers.length;

  // Manejar la creación de un nuevo usuario
  const handleCreateUser = userData => {
    // En una implementación real, aquí se haría una llamada API
    const newUser = {
      id: users.length + 1,
      ...userData,
      status: 'pending',
      lastLogin: null,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    setIsCreateModalOpen(false);
  };

  // Abrir modal de edición con los datos del usuario
  const handleOpenEditModal = user => {
    setCurrentUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  // Manejar cambios en el formulario de edición
  const handleEditFormChange = (field, value) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };

  // Guardar los cambios del usuario
  const handleSaveEditUser = () => {
    // En una implementación real, aquí se haría una llamada API
    setUsers(
      users.map(user =>
        user.id === currentUser.id ? { ...user, ...editFormData } : user
      )
    );
    setIsEditModalOpen(false);
  };

  // Manejar cambio de estado de un usuario
  const handleStatusChange = (userId, newStatus) => {
    // En una implementación real, aquí se haría una llamada API
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  // Función para exportar la lista de usuarios a PDF
  const handleExportUsers = async () => {
    try {
      await generateUsersPDF({
        users: filteredUsers,
        stats: userStats,
        selectedStatus,
        searchTerm,
        totalUsers: filteredUsers.length
      });
    } catch (error) {
      console.error('Error al exportar usuarios:', error);
      // Aquí se podría mostrar un toast o alerta al usuario
    }
  };

  // Funciones de navegación entre páginas
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <PageHeader title={title} description={description} />

      {/* Estadísticas de usuarios */}
      <UserStats stats={userStats} />

      {/* Barra de herramientas */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-8'>
        {/* Búsqueda */}
        <div className='relative w-full md:w-auto'>
          <input
            type='text'
            placeholder='Buscar usuarios...'
            className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
        </div>

        {/* Botones de acción */}
        <div className='flex gap-2 w-full md:w-auto'>
          <button
            className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className='h-5 w-5' />
            <span className='hidden md:inline'>Nuevo Usuario</span>
          </button>

          <button
            className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
            onClick={handleExportUsers}
          >
            <Download className='h-5 w-5' />
            <span className='hidden md:inline'>Exportar</span>
          </button>
        </div>
      </div>

      {/* Filtros por estado - Versión responsiva */}
      <div className='mb-6 overflow-x-auto'>
        <div className='flex gap-2 min-w-max pb-1'>
          <button
            className={`px-3 py-2 md:px-4 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              selectedStatus === 'all'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedStatus('all')}
          >
            <span className='text-xs md:text-sm'>Todos</span>
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 md:px-4 rounded-lg whitespace-nowrap ${
              selectedStatus === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedStatus('active')}
          >
            <CheckCircle className='h-3 w-3 md:h-4 md:w-4' />
            <span className='text-xs md:text-sm'>Activos</span>
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 md:px-4 rounded-lg whitespace-nowrap ${
              selectedStatus === 'inactive'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedStatus('inactive')}
          >
            <XCircle className='h-3 w-3 md:h-4 md:w-4' />
            <span className='text-xs md:text-sm'>Inactivos</span>
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 md:px-4 rounded-lg whitespace-nowrap ${
              selectedStatus === 'pending'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedStatus('pending')}
          >
            <Clock className='h-3 w-3 md:h-4 md:w-4' />
            <span className='text-xs md:text-sm'>Pendientes</span>
          </button>
        </div>
      </div>

      {/* Tabla de usuarios - Oculta en dispositivos móviles */}
      <div className='hidden sm:block bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Usuario
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Correo
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Rol Asignado
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Estado
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Último Acceso
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Fecha Registro
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentPageUsers.map(user => (
              <tr key={user.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='font-medium text-gray-900'>{user.name}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {user.email}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {user.role}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {user.status === 'active'
                      ? 'Activo'
                      : user.status === 'inactive'
                      ? 'Inactivo'
                      : 'Pendiente'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Nunca'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <div className='flex gap-3 items-center'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className='text-indigo-600 hover:text-indigo-900'
                            onClick={() => handleOpenEditModal(user)}
                          >
                            <Pencil className='h-4 w-4' />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar usuario</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {user.status === 'active' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className='text-red-600 hover:text-red-900'
                              onClick={() =>
                                handleStatusChange(user.id, 'inactive')
                              }
                            >
                              <Ban className='h-4 w-4' />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Desactivar usuario</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className='text-green-600 hover:text-green-900'
                              onClick={() =>
                                handleStatusChange(user.id, 'active')
                              }
                            >
                              <Check className='h-4 w-4' />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Activar usuario</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>
              No se encontraron usuarios con los criterios de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Vista de tarjetas para móvil */}
      <div className='sm:hidden space-y-3'>
        {currentPageUsers.map(user => (
          <div
            key={user.id}
            className='bg-white border rounded-lg p-3 shadow-sm'
          >
            <div className='flex justify-between items-start mb-2'>
              <div>
                <h3 className='font-medium text-sm'>{user.name}</h3>
                <p className='text-xs text-muted-foreground'>{user.email}</p>
              </div>
              <div className='flex flex-shrink-0'>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : user.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {user.status === 'active'
                    ? 'Activo'
                    : user.status === 'inactive'
                    ? 'Inactivo'
                    : 'Pendiente'}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-y-1 mb-2'>
              <div className='flex items-center text-xs'>
                <span className='text-muted-foreground mr-1'>Rol:</span>
                <span className='truncate'>{user.role}</span>
              </div>
              <div className='flex items-center text-xs'>
                <span className='text-muted-foreground mr-1'>
                  Último acceso:
                </span>
                <span className='truncate'>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Nunca'}
                </span>
              </div>
              <div className='flex items-center text-xs'>
                <span className='text-muted-foreground mr-1'>Registro:</span>
                <span className='truncate'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className='flex justify-end items-center mt-3 pt-2 border-t border-gray-100'>
              <div className='flex gap-3'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className='text-indigo-600 hover:text-indigo-900'
                        onClick={() => handleOpenEditModal(user)}
                      >
                        <Pencil className='h-4 w-4' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar usuario</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {user.status === 'active' ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className='text-red-600 hover:text-red-900'
                          onClick={() =>
                            handleStatusChange(user.id, 'inactive')
                          }
                        >
                          <Ban className='h-4 w-4' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Desactivar usuario</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className='text-green-600 hover:text-green-900'
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          <Check className='h-4 w-4' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Activar usuario</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Mensaje cuando no hay usuarios */}
        {filteredUsers.length === 0 && (
          <div className='bg-white border rounded-lg p-4 text-center'>
            <p className='text-gray-500 text-sm'>No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mt-6 px-2 gap-2'>
          <div className='text-xs sm:text-sm text-gray-500 order-2 sm:order-1 text-center sm:text-left'>
            Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
            {Math.min(currentPage * pageSize, totalUsers)} de {totalUsers}{' '}
            usuarios
          </div>
          <div className='flex space-x-2 justify-center sm:justify-end order-1 sm:order-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className='h-8 w-8 p-0'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='flex items-center text-xs sm:text-sm px-2 font-medium'>
              {currentPage} de {totalPages}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className='h-8 w-8 p-0'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {/* Modal para crear usuario */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

      {/* Modal para editar usuario */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={currentUser}
        formData={editFormData}
        onChange={handleEditFormChange}
        onSave={handleSaveEditUser}
      />
    </div>
  );
}
