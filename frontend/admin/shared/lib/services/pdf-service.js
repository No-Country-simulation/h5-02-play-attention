/**
 * Servicio centralizado para la generación de PDFs
 * Sigue el principio de responsabilidad única (SRP) y favorece la reutilización
 */

/**
 * Genera un PDF con un formato consistente para toda la aplicación
 *
 * @param {Object} options - Opciones para generar el PDF
 * @param {string} options.title - Título del documento
 * @param {Object} options.info - Información adicional para la cabecera (key-value pairs)
 * @param {Array} options.filters - Array de strings con los filtros aplicados
 * @param {Array} options.stats - Array de arrays para la tabla de estadísticas [[label, value], ...]
 * @param {Array} options.tableHeaders - Cabeceras para la tabla principal
 * @param {Array} options.tableData - Datos para la tabla principal (array de arrays)
 * @param {string} options.filename - Nombre del archivo PDF a generar
 * @returns {Promise<void>} - Promesa que se resuelve cuando el PDF ha sido generado y descargado
 */
export const generatePDF = async ({
  title,
  info = {},
  filters = [],
  stats = [],
  tableHeaders = [],
  tableData = [],
  filename = 'reporte.pdf'
}) => {
  try {
    // Importar jsPDF y autoTable dinámicamente
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    // Crear un nuevo documento PDF
    const doc = new jsPDF();
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
    doc.text(title, 14, 45);

    // Información adicional
    doc.setFontSize(12);
    let yPos = 55;

    // Añadir fecha de generación por defecto
    doc.text(
      `Fecha de generación: ${new Date().toLocaleDateString()}`,
      14,
      yPos
    );
    yPos += 7;

    // Añadir información adicional
    Object.entries(info).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, yPos);
      yPos += 7;
    });

    // Agregar información de filtros
    if (filters.length > 0) {
      doc.text(`Filtros aplicados: ${filters.join(', ')}`, 14, yPos);
      yPos += 7;
    }

    // Estadísticas generales (si hay)
    if (stats.length > 0) {
      doc.setFontSize(14);
      doc.text('Estadísticas Generales', 14, yPos);
      yPos += 4;

      autoTable(doc, {
        startY: yPos,
        head: [['Métrica', 'Valor']],
        body: stats,
        theme: 'grid',
        headStyles: { fillColor: [124, 77, 255] }
      });

      // La siguiente posición Y será después de la tabla
      yPos = doc.lastAutoTable.finalY + 10;
    }

    // Si hay datos para la tabla principal, iniciarla en nueva página
    if (tableHeaders.length > 0 && tableData.length > 0) {
      doc.addPage();

      // Repetir el encabezado estilizado
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
      doc.text(`Listado detallado - ${title}`, 14, 45);

      // Tabla principal con los datos
      autoTable(doc, {
        startY: 55,
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [124, 77, 255] },
        styles: { fontSize: 9 }
      });
    }

    // Guardar el PDF
    doc.save(filename);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw new Error('Error al generar el PDF');
  }
};
