/**
 * Servicio para la generación de PDFs de leads
 * Sigue el principio de responsabilidad única (SRP)
 */

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
    // Importar jsPDF y autoTable dinámicamente
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // En lugar de cargar una imagen externa, vamos a usar texto estilizado para el encabezado
    // Esto evita problemas de carga de imágenes
    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado con texto estilizado
    doc.setFontSize(22);
    doc.setTextColor(124, 77, 255); // Color morado que combina con el tema
    doc.setFont(undefined, 'bold');
    doc.text('PLAY ATTENTION', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text('Plataforma de Concentración y Aprendizaje', pageWidth / 2, 28, {
      align: 'center'
    });

    // Línea decorativa
    doc.setDrawColor(124, 77, 255);
    doc.setLineWidth(0.5);
    doc.line(14, 32, pageWidth - 14, 32);

    // Título del documento
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Reporte de Leads', 14, 45);

    // Información del filtro de tiempo y otros filtros
    const timeRangeText = {
      '7days': 'Últimos 7 días',
      '30days': 'Últimos 30 días',
      '90days': 'Últimos 90 días',
      year: 'Este año',
      all: 'Todo el tiempo'
    }[timeRange];

    doc.setFontSize(12);
    doc.text(`Período: ${timeRangeText}`, 14, 55);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 62);

    // Agregar información de filtros
    const filterInfo = [];
    if (filters.status && filters.status !== 'all')
      filterInfo.push(`Estado: ${filters.status}`);
    if (filters.userType && filters.userType !== 'all')
      filterInfo.push(`Tipo: ${filters.userType}`);
    if (filters.search) filterInfo.push(`Búsqueda: ${filters.search}`);

    if (filterInfo.length > 0) {
      doc.text(`Filtros aplicados: ${filterInfo.join(', ')}`, 14, 69);
    }

    // Estadísticas generales
    doc.setFontSize(14);
    doc.text('Estadísticas Generales', 14, 80);

    autoTable(doc, {
      startY: 84,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total de Leads', totalLeads.toString()],
        ['Nuevos Leads', metrics.newLeads.toString()],
        ['Tasa de Conversión', `${metrics.conversionRate}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [124, 77, 255] }
    });

    // Tabla de Leads por Tipo de Usuario
    doc.setFontSize(14);
    doc.text('Leads por Tipo de Usuario', 14, doc.lastAutoTable.finalY + 15);

    const typeTableData = metrics.byType.map(item => [
      item.name,
      item.value.toString()
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Tipo de Usuario', 'Cantidad']],
      body: typeTableData,
      theme: 'grid',
      headStyles: { fillColor: [124, 77, 255] }
    });

    // Lista detallada de leads
    doc.addPage();

    // Repetir el encabezado estilizado en la segunda página
    doc.setFontSize(22);
    doc.setTextColor(124, 77, 255);
    doc.setFont(undefined, 'bold');
    doc.text('PLAY ATTENTION', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text('Plataforma de Concentración y Aprendizaje', pageWidth / 2, 28, {
      align: 'center'
    });

    // Línea decorativa
    doc.setDrawColor(124, 77, 255);
    doc.setLineWidth(0.5);
    doc.line(14, 32, pageWidth - 14, 32);

    // Título de la segunda página
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Listado de Leads', 14, 45);

    const leadsData = leads.map(lead => [
      lead.name,
      lead.email,
      lead.company || 'N/A',
      lead.status || 'N/A',
      lead.userType || 'N/A',
      new Date(lead.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Nombre', 'Email', 'Empresa', 'Estado', 'Tipo', 'Fecha']],
      body: leadsData,
      theme: 'grid',
      headStyles: { fillColor: [124, 77, 255] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 }
      }
    });

    // Guardar el PDF
    doc.save('reporte-leads.pdf');
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw new Error('Error al generar el PDF');
  }
};
