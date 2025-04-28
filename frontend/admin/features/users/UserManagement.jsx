'use client';

import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';
import UserStats from './components/stats/UserStats';
import UserCreateModal from './components/modals/UserCreateModal';
import UserEditModal from './components/modals/UserEditModal';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { useUserManagement } from './lib/hooks';
import UserTable from './components/table/UserTable';
import GroupedUsersView from './components/views/GroupedUsersView';
import UserToolbar from './components/toolbar/UserToolbar';
import UserStatusFilters from './components/filters/UserStatusFilters';
import UserPagination from './components/table/UserPagination';

/**
 * Componente principal de gestión de usuarios
 * Refactorizado para seguir principios SOLID
 *
 * - SRP: Cada componente tiene una única responsabilidad
 * - OCP: Extensible a través de componentes separados sin modificar este componente
 */
export default function UserManagement() {
  const { title, description } = getPageMetadata('users');

  // Usar el hook que contiene toda la lógica
  const {
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
  } = useUserManagement();

  // Estado de carga
  if (isLoading) {
    return (
      <div className='p-3 sm:p-4 lg:p-6 max-w-full mx-auto lg:max-w-7xl'>
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
      <div className='p-3 sm:p-4 lg:p-6 max-w-full mx-auto lg:max-w-7xl'>
        <PageHeader title={title} description={description} />
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6'>
          <p>Error al cargar los usuarios: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-3 sm:p-4 lg:p-6 max-w-full mx-auto lg:max-w-7xl'>
      <PageHeader title={title} description={description} />

      {/* Estadísticas de usuarios */}
      <UserStats stats={userStats} />

      {/* Barra de herramientas */}
      <UserToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onExportClick={handleExportUsers}
        viewLayout={viewLayout}
        onViewLayoutChange={setViewLayout}
      />

      {/* Filtros por estado */}
      <UserStatusFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Vista condicional según el layout */}
      {viewLayout === 'list' ? (
        <>
          {/* Vista de tabla */}
          <UserTable
            users={currentPageUsers}
            updatingRoles={updatingRoles}
            updatingStatuses={updatingStatuses}
            onEditUser={handleOpenEditModal}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
          />

          {/* Paginación - Solo en vista de lista */}
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            currentCount={currentUsersCount}
            totalCount={totalUsers}
            pageSize={pageSize}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
          />
        </>
      ) : (
        /* Vista agrupada */
        <GroupedUsersView
          groupedUsers={groupedUsers}
          updatingRoles={updatingRoles}
          updatingStatuses={updatingStatuses}
          onEditUser={handleOpenEditModal}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
        />
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
          onSave={handleSaveEditUser}
          user={currentUser}
          formData={editFormData}
          onChange={handleEditFormChange}
        />
      )}
    </div>
  );
}
