import { useState } from 'react';
import useUsers from './useUsers';
import useCreateUser from './useCreateUser';
import useUpdateUserRole from './useUpdateUserRole';
import useUpdateUserStatus from './useUpdateUserStatus';
import useUpdateUser from './useUpdateUser';
import { toast } from 'sonner';
import { generateUsersPDF } from '../adapters/pdf-adapter';

// Constantes de roles y estados
export const ROLES_USUARIO = [
  { value: 'User', label: 'Usuario' },
  { value: 'Admin', label: 'Administrador' },
  { value: 'Comercial', label: 'Comercial' }
];

export const ESTADOS_USUARIO = [
  { value: 'active', label: 'Activo', isActive: true },
  { value: 'inactive', label: 'Inactivo', isActive: false }
];

/**
 * Hook que encapsula la lógica de gestión de usuarios
 * Separa la lógica de UI permitiendo la reutilización
 */
const useUserManagement = () => {
  const { data: usersData, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserRoleMutation = useUpdateUserRole();
  const updateUserStatusMutation = useUpdateUserStatus();
  const updateUserMutation = useUpdateUser();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewLayout, setViewLayout] = useState('list');
  const [updatingRoles, setUpdatingRoles] = useState({});
  const [updatingStatuses, setUpdatingStatuses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'Usuario'
  });
  console.log(usersData);
  // Transformar datos del API al formato esperado
  const users = usersData?.data
    ? usersData.data.map(user => ({
        id: user._id,
        name: user.fullname,
        fullname: user.fullname,
        email: user.email,
        role: user.role || 'Usuario',
        status: user.isActive ? 'active' : 'inactive',
        lastLogin: null,
        createdAt: user.createdAt
      }))
    : [];

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

  // Agrupar usuarios por roles
  const getGroupedUsers = () => {
    const team = filteredUsers.filter(
      user => user.role === 'Admin' || user.role === 'Comercial'
    );

    const clients = filteredUsers.filter(user => user.role === 'User');

    return {
      team,
      clients
    };
  };

  const groupedUsers = getGroupedUsers();

  // Calcular estadísticas de usuarios
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

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const total = users.length;
    const active = users.filter(user => user.status === 'active').length;
    const inactive = users.filter(user => user.status === 'inactive').length;
    const pending = users.filter(user => user.status === 'pending').length;

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

  const userStats = calculateUserStats();

  // Manejo de creación de usuario
  const handleCreateUser = userData => {
    const { confirmPassword, name, ...userDataForApi } = userData;

    createUserMutation.mutate(userDataForApi, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
      onError: error => {
        console.error('Error al crear usuario:', error);
      }
    });
  };

  // Manejo de edición de usuario
  const handleOpenEditModal = user => {
    setCurrentUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };

  const handleSaveEditUser = () => {
    if (!currentUser) {
      toast.error('No se pudo identificar el usuario a editar');
      return;
    }

    // Crear un objeto con los datos que queremos actualizar
    const userData = {
      // Si el campo name cambia, lo incluimos en la actualización
      ...(editFormData.name !== currentUser.name && {
        name: editFormData.name
      }),
      // Si el campo email cambia, lo incluimos en la actualización
      ...(editFormData.email !== currentUser.email && {
        email: editFormData.email
      }),
      // Si el campo role cambia, lo incluimos en la actualización
      ...(editFormData.role !== currentUser.role && { role: editFormData.role })
    };

    // Si no hay cambios, simplemente cerramos el modal
    if (Object.keys(userData).length === 0) {
      setIsEditModalOpen(false);
      return;
    }

    // Llamar a la mutación para actualizar los datos del usuario
    updateUserMutation.mutate(
      { userId: currentUser.id, userData },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
        }
      }
    );
  };

  // Manejo de cambio de estado de usuario
  const handleStatusChange = (userId, newStatus) => {
    if (!userId) {
      toast.error('No se pudo identificar el usuario');
      return;
    }

    const estadoObj = ESTADOS_USUARIO.find(
      estado => estado.value === newStatus
    );
    if (!estadoObj) {
      toast.error('Estado no válido');
      return;
    }

    setUpdatingStatuses(prev => ({ ...prev, [userId]: true }));

    updateUserStatusMutation.mutate(
      { userId, isActive: estadoObj.isActive },
      {
        onSuccess: () => {
          setUpdatingStatuses(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        },
        onError: error => {
          console.error('Error al actualizar el estado:', error);
          setUpdatingStatuses(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        }
      }
    );
  };

  // Manejo de cambio de rol de usuario
  const handleRoleChange = (userId, newRole) => {
    if (!userId) {
      toast.error('No se pudo identificar el usuario');
      return;
    }

    setUpdatingRoles(prev => ({ ...prev, [userId]: true }));

    updateUserRoleMutation.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => {
          setUpdatingRoles(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        },
        onError: error => {
          console.error('Error al actualizar el rol:', error);
          setUpdatingRoles(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        }
      }
    );
  };

  // Exportar a PDF
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
    }
  };

  // Navegación entre páginas
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

  return {
    // Estado
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    currentUser,
    selectedStatus,
    setSelectedStatus,
    viewLayout,
    setViewLayout,
    updatingRoles,
    updatingStatuses,
    editFormData,
    currentPage,
    pageSize,
    totalPages,

    // Datos
    users,
    filteredUsers,
    currentPageUsers,
    groupedUsers,
    userStats,
    totalUsers,
    currentUsersCount,

    // Manejadores
    handleCreateUser,
    handleOpenEditModal,
    handleEditFormChange,
    handleSaveEditUser,
    handleStatusChange,
    handleRoleChange,
    handleExportUsers,
    goToPreviousPage,
    goToNextPage
  };
};

export default useUserManagement;
