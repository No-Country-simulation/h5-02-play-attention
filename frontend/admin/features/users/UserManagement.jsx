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
import { useUsers } from './lib/hooks';

/**
 * Componente principal de gestión de usuarios
 * Se enfoca exclusivamente en la administración de usuarios, sus datos y estados,
 * dejando la gestión de roles y permisos para su sección correspondiente
 */
export default function UserManagement() {
  const { data: usersData, isLoading, error } = useUsers();
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

  // Transformar datos del API al formato esperado por el componente
  const users = usersData?.data
    ? usersData.data.map(user => ({
        id: user._id,
        name: user.email.split('@')[0], // Usamos parte del email como nombre por ahora
        email: user.email,
        role: user.role || 'Usuario',
        status: user.isActive ? 'active' : 'inactive',
        lastLogin: null, // El API no proporciona esta info
        createdAt: user.createdAt
      }))
    : [];

  // Calcular estadísticas reales de usuarios
  const calculateUserStats = () => {
    if (!users.length) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        newThisMonth: 0
      };
    }

    // Obtener el mes actual y año
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const total = users.length;
    const active = users.filter(user => user.status === 'active').length;
    const inactive = users.filter(user => user.status === 'inactive').length;
    const pending = users.filter(user => user.status === 'pending').length;

    // Contar usuarios creados este mes
    const newThisMonth = users.filter(user => {
      const createdDate = new Date(user.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    return {
      total,
      active,
      inactive,
      pending,
      newThisMonth
    };
  };

  // Estadísticas reales de usuarios
  const userStats = calculateUserStats();

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

    // setUsers([...users, newUser]);
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
    // setUsers(
    //   users.map(user =>
    //     user.id === currentUser.id ? { ...user, ...editFormData } : user
    //   )
    // );
    setIsEditModalOpen(false);
  };

  // Manejar cambio de estado de un usuario
  const handleStatusChange = (userId, newStatus) => {
    // En una implementación real, aquí se haría una llamada API
    // setUsers(
    //   users.map(user =>
    //     user.id === userId ? { ...user, status: newStatus } : user
    //   )
    // );
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

  // Estado de carga
  if (isLoading) {
    return (
      <div className='p-6 max-w-7xl mx-auto'>
        <PageHeader title={title} description={description} />
        <div className='flex justify-center items-center mt-10'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className='p-6 max-w-7xl mx-auto'>
        <PageHeader title={title} description={description} />
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6'>
          <p>Error al cargar los usuarios: {error.message}</p>
        </div>
      </div>
    );
  }

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
            className='flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 text-white text-sm rounded-lg hover:bg-purple-800 transition-colors'
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className='h-4 w-4' />
            <span>Nuevo Usuario</span>
          </button>

          <button
            className='flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-sm rounded-lg bg-white hover:bg-gray-50 transition-colors'
            onClick={handleExportUsers}
          >
            <Download className='h-4 w-4' />
            <span>Exportar</span>
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

      {/* Tabla de usuarios */}
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
            {currentPageUsers.length > 0 ? (
              currentPageUsers.map(user => (
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
                    <div className='text-sm text-gray-500'>{user.role}</div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      {user.status === 'active' && (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                          <CheckCircle className='h-4 w-4 mr-1' />
                          Activo
                        </span>
                      )}
                      {user.status === 'inactive' && (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                          <XCircle className='h-4 w-4 mr-1' />
                          Inactivo
                        </span>
                      )}
                      {user.status === 'pending' && (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800'>
                          <Clock className='h-4 w-4 mr-1' />
                          Pendiente
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className='py-4 px-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex space-x-2'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              <Pencil className='h-5 w-5' />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar usuario</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {user.status === 'active' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  handleStatusChange(user.id, 'inactive')
                                }
                                className='text-red-600 hover:text-red-900'
                              >
                                <Ban className='h-5 w-5' />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Desactivar usuario</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {user.status === 'inactive' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  handleStatusChange(user.id, 'active')
                                }
                                className='text-green-600 hover:text-green-900'
                              >
                                <Check className='h-5 w-5' />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Activar usuario</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {user.status === 'pending' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  handleStatusChange(user.id, 'active')
                                }
                                className='text-green-600 hover:text-green-900'
                              >
                                <Check className='h-5 w-5' />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Aprobar usuario</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
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

      {/* Paginación */}
      <div className='flex justify-between items-center mb-8'>
        <div className='text-sm text-gray-700'>
          Mostrando{' '}
          <span className='font-medium'>
            {currentPageUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          a{' '}
          <span className='font-medium'>
            {(currentPage - 1) * pageSize + currentUsersCount}
          </span>{' '}
          de <span className='font-medium'>{totalUsers}</span> resultados
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Modal de creación de usuario */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {/* Modal de edición de usuario */}
      {currentUser && (
        <UserEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSaveEditUser}
          formData={editFormData}
          onChange={handleEditFormChange}
        />
      )}
    </div>
  );
}
