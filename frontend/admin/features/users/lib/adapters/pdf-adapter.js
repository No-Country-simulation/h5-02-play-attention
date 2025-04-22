/**
 * Adaptador del servicio de PDF para usuarios
 * Sigue el principio de responsabilidad única (SRP) al encargarse únicamente
 * de transformar los datos de usuarios al formato requerido por el servicio centralizado
 */

import { generatePDF } from '@/shared/lib/services/pdf-service';

/**
 * Genera un PDF con el listado completo de usuarios
 *
 * @param {Object} options - Opciones para generar el PDF
 * @param {Array} options.users - Lista de usuarios para incluir en el reporte
 * @param {Object} options.stats - Estadísticas de usuarios
 * @param {string} options.selectedStatus - Filtro de estado seleccionado
 * @param {string} options.searchTerm - Término de búsqueda aplicado
 * @param {number} options.totalUsers - Total de usuarios después de aplicar filtros
 * @returns {Promise<void>} - Promesa que se resuelve cuando el PDF ha sido generado y descargado
 */
export const generateUsersPDF = async ({
  users,
  stats,
  selectedStatus,
  searchTerm,
  totalUsers
}) => {
  try {
    // Preparar filtros
    const filters = [];

    // Mapeo de estados a textos legibles
    const statusLabels = {
      all: 'Todos',
      active: 'Activos',
      inactive: 'Inactivos',
      pending: 'Pendientes'
    };

    if (selectedStatus !== 'all') {
      filters.push(`Estado: ${statusLabels[selectedStatus] || selectedStatus}`);
    }

    if (searchTerm) {
      filters.push(`Búsqueda: ${searchTerm}`);
    }

    // Preparar datos de estadísticas
    const statsData = [
      ['Total de Usuarios', stats.total.toString()],
      ['Usuarios Activos', stats.active.toString()],
      ['Usuarios Inactivos', stats.inactive.toString()],
      ['Usuarios Pendientes', stats.pending.toString()],
      ['Nuevos este mes', stats.newThisMonth.toString()]
    ];

    // Función para formatear estado
    const formatStatus = status => {
      switch (status) {
        case 'active':
          return 'Activo';
        case 'inactive':
          return 'Inactivo';
        case 'pending':
          return 'Pendiente';
        default:
          return status;
      }
    };

    // Formatear fecha
    const formatDate = dateString => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString();
      } catch (error) {
        return 'Fecha inválida';
      }
    };

    // Preparar datos de la tabla
    const tableHeaders = [
      'Nombre',
      'Email',
      'Rol',
      'Estado',
      'Último Acceso',
      'Registro'
    ];
    const tableData = users.map(user => [
      user.name,
      user.email,
      user.role,
      formatStatus(user.status),
      user.lastLogin ? formatDate(user.lastLogin) : 'Nunca',
      formatDate(user.createdAt)
    ]);

    // Generar el PDF usando el servicio compartido
    await generatePDF({
      title: 'Reporte de Usuarios',
      filters,
      stats: statsData,
      tableHeaders,
      tableData,
      filename: 'reporte-usuarios.pdf'
    });
  } catch (error) {
    console.error('Error al generar el PDF de usuarios:', error);
    throw new Error('Error al generar el PDF de usuarios');
  }
};
