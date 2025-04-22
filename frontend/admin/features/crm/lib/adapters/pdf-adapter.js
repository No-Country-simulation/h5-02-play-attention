/**
 * Adaptador del servicio de PDF para leads
 * Sigue el principio de responsabilidad única (SRP) al encargarse únicamente
 * de transformar los datos de leads al formato requerido por el servicio centralizado
 */

import { generatePDF } from '@/shared/lib/services/pdf-service';

/**
 * Genera un PDF con el reporte completo de leads
 *
 * @param {Object} options - Opciones para generar el PDF
 * @param {Array} options.leads - Lista de leads para incluir en el reporte
 * @param {Object} options.metrics - Métricas calculadas para el dashboard
 * @param {Object} options.filters - Filtros aplicados a los leads
 * @param {string} options.timeRange - Rango de tiempo seleccionado
 * @param {number} options.totalLeads - Total de leads después de aplicar filtros
 * @returns {Promise<void>} - Promesa que se resuelve cuando el PDF ha sido generado y descargado
 */
export const generateLeadsPDF = async ({
  leads,
  metrics,
  filters,
  timeRange,
  totalLeads
}) => {
  try {
    // Preparar información adicional
    const timeRangeText = {
      '7days': 'Últimos 7 días',
      '30days': 'Últimos 30 días',
      '90days': 'Últimos 90 días',
      year: 'Este año',
      all: 'Todo el tiempo'
    }[timeRange];

    const info = {
      Período: timeRangeText
    };

    // Preparar filtros
    const filterInfo = [];
    if (filters.status && filters.status !== 'all')
      filterInfo.push(`Estado: ${filters.status}`);
    if (filters.userType && filters.userType !== 'all')
      filterInfo.push(`Tipo: ${filters.userType}`);
    if (filters.search) filterInfo.push(`Búsqueda: ${filters.search}`);

    // Preparar datos de estadísticas
    const statsData = [
      ['Total de Leads', totalLeads.toString()],
      ['Nuevos Leads', metrics.newLeads.toString()],
      ['Tasa de Conversión', `${metrics.conversionRate}%`]
    ];

    // Agregar estadísticas por tipo de usuario
    const typeTableData = metrics.byType.map(item => [
      item.name,
      item.value.toString()
    ]);

    // Formatear fecha
    const formatDate = date => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString();
      } catch (e) {
        return 'Fecha inválida';
      }
    };

    // Preparar datos de la tabla
    const tableHeaders = [
      'Nombre',
      'Email',
      'Empresa',
      'Estado',
      'Tipo',
      'Fecha'
    ];
    const tableData = leads.map(lead => [
      lead.name,
      lead.email,
      lead.company || 'N/A',
      lead.status || 'N/A',
      lead.userType || 'N/A',
      formatDate(lead.createdAt)
    ]);

    // Generar el PDF usando el servicio compartido
    await generatePDF({
      title: 'Reporte de Leads',
      info,
      filters: filterInfo,
      stats: [...statsData, ...typeTableData],
      tableHeaders,
      tableData,
      filename: 'reporte-leads.pdf'
    });
  } catch (error) {
    console.error('Error al generar el PDF de leads:', error);
    throw new Error('Error al generar el PDF de leads');
  }
};
