import { useMemo } from 'react';

/**
 * Hook para calcular métricas de leads
 * @param {Array} leads - Lista de leads
 * @param {String} timeRange - Rango de tiempo seleccionado
 * @param {Boolean} isLoading - Estado de carga
 * @returns {Object} - Objeto con las métricas calculadas
 */
export const useLeadMetrics = (leads, timeRange, isLoading) => {
  return useMemo(() => {
    if (isLoading || leads.length === 0) {
      return {
        totalLeads: 0,
        newLeads: 0,
        conversionRate: 0,
        byStatus: [],
        byType: []
      };
    }

    // Total de leads
    const totalLeads = leads.length;

    // Leads nuevos - basado en fecha o estado según timeRange
    let newLeads = 0;

    if (timeRange === 'all') {
      // Si es "Todo el tiempo", contar por estado
      newLeads = leads.filter(lead => lead.status === 'nuevo').length;
    } else {
      // Para otros rangos, filtrar por fecha de creación
      const cutoffDate = new Date();
      if (timeRange === '7days') {
        cutoffDate.setDate(cutoffDate.getDate() - 7);
      } else if (timeRange === '90days') {
        cutoffDate.setDate(cutoffDate.getDate() - 90);
      } else if (timeRange === 'year') {
        cutoffDate.setMonth(cutoffDate.getMonth() - 12);
      } else {
        // Por defecto 30 días
        cutoffDate.setDate(cutoffDate.getDate() - 30);
      }

      newLeads = leads.filter(lead => {
        try {
          const createdAt = new Date(lead.createdAt);
          return createdAt >= cutoffDate;
        } catch (e) {
          return false;
        }
      }).length;
    }

    // Tasa de conversión (leads con estado "convertido" o "cliente")
    const convertedLeads = leads.filter(
      lead => lead.status === 'convertido' || lead.status === 'cliente'
    ).length;
    const conversionRate =
      totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Agrupar por estado
    const statusMap = {};
    leads.forEach(lead => {
      let status = lead.status || 'sin estado';
      // Transformar "negociación" a "proceso"
      if (
        status.toLowerCase() === 'negociación' ||
        status.toLowerCase() === 'negociacion'
      ) {
        status = 'proceso';
      }
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    const byStatus = Object.entries(statusMap).map(([name, value]) => ({
      name,
      value
    }));

    // Agrupar por tipo (si existe, de lo contrario usar "no clasificado")
    const typeMap = {};
    leads.forEach(lead => {
      let type = lead.userType || 'no clasificado';
      // Transformar "individual" a "persona"
      if (type.toLowerCase() === 'individual') {
        type = 'persona';
      }
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    const byType = Object.entries(typeMap).map(([name, value]) => ({
      name,
      value
    }));

    // Si no hay datos, agregar al menos algunos datos de muestra para prevenir errores
    if (byType.length === 0) {
      byType = [
        { name: 'Persona', value: 45 },
        { name: 'Cliente', value: 28 },
        { name: 'Partner', value: 17 },
        { name: 'Distribuidor', value: 10 }
      ];
    }
    if (byStatus.length === 0) {
      byStatus.push({ name: 'Sin datos', value: 1 });
    }

    return {
      totalLeads,
      newLeads,
      conversionRate: conversionRate.toFixed(1),
      byStatus,
      byType,
      conversionData: [
        { name: 'Convertidos', value: convertedLeads },
        { name: 'No convertidos', value: totalLeads - convertedLeads }
      ]
    };
  }, [leads, isLoading, timeRange]);
};
