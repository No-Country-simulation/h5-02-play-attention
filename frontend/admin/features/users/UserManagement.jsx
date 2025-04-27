'use client';

import { useState } from 'react';
import {
  Search,
  PlusCircle,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList
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
import {
  useUsers,
  useCreateUser,
  useUpdateUserRole,
  useUpdateUserStatus
} from './lib/hooks';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { toast } from 'sonner';

// Mapeo de roles disponibles en el sistema
const ROLES_USUARIO = [
  { value: 'User', label: 'Usuario' },
  { value: 'Admin', label: 'Administrador' },
  { value: 'Comercial', label: 'Comercial' }
];

// Mapeo de estados de usuario
const ESTADOS_USUARIO = [
  { value: 'active', label: 'Activo', isActive: true },
  { value: 'inactive', label: 'Inactivo', isActive: false }
];

/**
 * Componente principal de gestión de usuarios
 * Se enfoca exclusivamente en la administración de usuarios, sus datos y estados,
 * dejando la gestión de roles y permisos para su sección correspondiente
 */
export default function UserManagement() {
  const { data: usersData, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserRoleMutation = useUpdateUserRole();
  const updateUserStatusMutation = useUpdateUserStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { title, description } = getPageMetadata('users');
  // Estado para rastrear roles en proceso de actualización
  const [updatingRoles, setUpdatingRoles] = useState({});
  // Estado para rastrear estados en proceso de actualización
  const [updatingStatuses, setUpdatingStatuses] = useState({});
  // Estado para controlar el tipo de layout
  const [viewLayout, setViewLayout] = useState('list'); // 'list' o 'grouped'

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

  // Agrupar usuarios por roles para la vista agrupada
  const getGroupedUsers = () => {
    // Separar entre equipo (Admin/Comercial) y clientes (User)
    const teamMembers = filteredUsers.filter(
      user => user.role === 'Admin' || user.role === 'Comercial'
    );

    const clients = filteredUsers.filter(user => user.role === 'User');

    return {
      teamMembers,
      clients
    };
  };

  const groupedUsers = getGroupedUsers();

  // Manejar la creación de un nuevo usuario
  const handleCreateUser = userData => {
    console.log('Datos del formulario:', userData);

    // Eliminar campos que no debe recibir el backend
    const { confirmPassword, name, ...userDataForApi } = userData;

    console.log('Datos a enviar a la API:', userDataForApi);

    // Llamar a la mutación para crear el usuario
    createUserMutation.mutate(userDataForApi, {
      onSuccess: data => {
        console.log('Usuario creado exitosamente:', data);
        setIsCreateModalOpen(false);
      },
      onError: error => {
        console.error('Error al crear usuario desde el componente:', error);
        // No cerramos el modal para permitir al usuario corregir los datos
      }
    });
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
    if (!userId) {
      toast.error('No se pudo identificar el usuario');
      return;
    }

    // Encontrar el objeto de estado correspondiente
    const estadoObj = ESTADOS_USUARIO.find(
      estado => estado.value === newStatus
    );
    if (!estadoObj) {
      toast.error('Estado no válido');
      return;
    }

    // Marcar este usuario como en proceso de actualización de estado
    setUpdatingStatuses(prev => ({ ...prev, [userId]: true }));

    // Llamar a la mutación para actualizar el estado
    updateUserStatusMutation.mutate(
      { userId, isActive: estadoObj.isActive },
      {
        onSuccess: () => {
          // Eliminar el estado de carga
          setUpdatingStatuses(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        },
        onError: error => {
          console.error('Error al actualizar el estado:', error);
          // Eliminar el estado de carga
          setUpdatingStatuses(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        }
      }
    );
  };

  // Manejar cambio de rol de un usuario
  const handleRoleChange = (userId, newRole) => {
    if (!userId) {
      toast.error('No se pudo identificar el usuario');
      return;
    }

    console.log(`Cambiando rol del usuario ${userId} a ${newRole}`);

    // Marcar este rol como en proceso de actualización
    setUpdatingRoles(prev => ({ ...prev, [userId]: true }));

    // Llamar a la mutación para actualizar el rol
    updateUserRoleMutation.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => {
          // Eliminar el estado de carga
          setUpdatingRoles(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        },
        onError: error => {
          console.error('Error al actualizar el rol:', error);
          // Eliminar el estado de carga
          setUpdatingRoles(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        }
      }
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

  // Estado de carga
  if (isLoading) {
    return (
      <div className='p-6 max-w-7xl mx-auto'>
        <PageHeader title={title} description={description} />
        <div className='flex justify-center items-center mt-10'>
          <LoadingSpinner text='Cargando usuarios' size={42} />
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
          {/* Selector de vista */}
          <div className='flex mr-2 rounded-lg overflow-hidden border border-gray-300'>
            <button
              className={`flex items-center justify-center p-1.5 h-8 w-8 ${
                viewLayout === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setViewLayout('list')}
              aria-label='Vista de lista'
            >
              <LayoutList className='h-4 w-4' />
            </button>
            <button
              className={`flex items-center justify-center p-1.5 h-8 w-8 ${
                viewLayout === 'grouped'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setViewLayout('grouped')}
              aria-label='Vista agrupada'
            >
              <LayoutGrid className='h-4 w-4' />
            </button>
          </div>

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

      {/* Vista condicional según el layout */}
      {viewLayout === 'list' ? (
        // Vista tradicional de tabla
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
                      <div className='relative'>
                        <Select
                          value={user.role}
                          onValueChange={value =>
                            handleRoleChange(user.id, value)
                          }
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
                            handleStatusChange(user.id, value)
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
                                onClick={() => handleOpenEditModal(user)}
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
                  <td
                    colSpan='6'
                    className='py-4 px-4 text-center text-gray-500'
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Vista agrupada por roles
        <div className='mb-6 space-y-6'>
          {/* Sección de equipo (Admin y Comercial) */}
          <div>
            <h2 className='text-lg font-semibold mb-3 text-purple-700 border-b pb-2'>
              Equipo de la empresa
            </h2>
            {groupedUsers.teamMembers.length > 0 ? (
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
                    {groupedUsers.teamMembers.map(user => (
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
                          <div className='text-sm text-gray-500'>
                            {user.email}
                          </div>
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap'>
                          <div className='relative'>
                            <Select
                              value={user.role}
                              onValueChange={value =>
                                handleRoleChange(user.id, value)
                              }
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
                                handleStatusChange(user.id, value)
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
                                    onClick={() => handleOpenEditModal(user)}
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
                No hay miembros del equipo para mostrar
              </p>
            )}
          </div>

          {/* Sección de clientes (User) */}
          <div>
            <h2 className='text-lg font-semibold mb-3 text-purple-700 border-b pb-2'>
              Usuarios / Clientes
            </h2>
            {groupedUsers.clients.length > 0 ? (
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
                    {groupedUsers.clients.map(user => (
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
                          <div className='text-sm text-gray-500'>
                            {user.email}
                          </div>
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap'>
                          <div className='relative'>
                            <Select
                              value={user.role}
                              onValueChange={value =>
                                handleRoleChange(user.id, value)
                              }
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
                                handleStatusChange(user.id, value)
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
                                    onClick={() => handleOpenEditModal(user)}
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
                No hay usuarios/clientes para mostrar
              </p>
            )}
          </div>
        </div>
      )}

      {/* Paginación - Solo en vista de lista */}
      {viewLayout === 'list' && (
        <div className='flex justify-between items-center mb-8'>
          <div className='text-sm text-gray-700'>
            Mostrando{' '}
            <span className='font-medium'>
              {currentPageUsers.length > 0
                ? (currentPage - 1) * pageSize + 1
                : 0}
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
      )}

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
