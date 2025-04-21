import { mockLeads } from '../config/mock-data';

/**
 * Función utilitaria para simular retrasos en las peticiones API
 * @param {number} ms - Milisegundos de retraso
 * @returns {Promise} - Promesa que se resuelve después del retraso
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene todos los leads
 * @param {Object} options - Opciones de filtrado y paginación
 * @returns {Promise<Array>} - Lista de leads adaptados
 */
export async function fetchLeads(options = {}) {
  try {
    // TODO: Implementar llamada real a la API con paginación
    // const response = await fetch('/api/leads', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   query: {
    //     page: options.page || 1,
    //     pageSize: options.pageSize || 4,
    //     status: options.status,
    //     search: options.search,
    //     source: options.source,
    //     priority: options.priority
    //   }
    // });
    // if (!response.ok) throw new Error('Error fetching leads');
    // const data = await response.json();
    // return {
    //   items: leadsAdapter(data.items),
    //   totalItems: data.totalItems,
    //   totalPages: data.totalPages,
    //   currentPage: data.currentPage
    // };

    // Mientras tanto, usamos datos mock con un delay simulado
    await delay(500);

    // Aplicar filtros si existen
    let filteredData = [...mockLeads];

    if (options.status && options.status !== 'all') {
      filteredData = filteredData.filter(
        lead => lead.status === options.status
      );
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredData = filteredData.filter(
        lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
          (lead.notes && lead.notes.toLowerCase().includes(searchLower))
      );
    }

    if (options.source && options.source !== 'all') {
      filteredData = filteredData.filter(
        lead => lead.source === options.source
      );
    }

    if (options.priority && options.priority !== 'all') {
      filteredData = filteredData.filter(
        lead => lead.priority === options.priority
      );
    }

    // Simulación de paginación
    // En un backend real, la paginación se haría en el servidor
    const page = options.page || 1;
    const pageSize = options.pageSize || 4;
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Para simular la paginación, solo devolvemos los leads de la página solicitada
    // En producción, esto se haría del lado del servidor
    // const startIndex = (page - 1) * pageSize;
    // const endIndex = startIndex + pageSize;
    // const paginatedData = filteredData.slice(startIndex, endIndex);

    // Simulamos el formato de respuesta que vendría del backend
    // return {
    //   items: paginatedData,
    //   totalItems: totalItems,
    //   totalPages: totalPages,
    //   currentPage: page
    // };

    // Mientras integramos la paginación completa, devolvemos solo los leads filtrados
    console.log(
      `Retornando ${filteredData.length} leads mockeados (Página ${page} de ${totalPages})`
    );
    return filteredData;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}
