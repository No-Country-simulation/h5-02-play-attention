import { create } from 'zustand';
import { mockLeads } from '../config/mock-data';

/**
 * Store para gestionar el estado relacionado con leads
 * Centraliza la lógica de estado, aplicando el principio de responsabilidad única
 */
export const useLeadsStore = create((set, get) => ({
  // Estado
  allLeads: [], // Almacenará todos los leads (mock/fetched)
  leads: [], // Almacenará los leads a mostrar (filtrados, pero no paginados por el store)
  totalLeads: 0, // Total después de filtros
  isLoading: false,
  hasError: false,
  errorMessage: '',

  // Filtros
  filters: {
    status: 'all',
    userType: 'all',
    search: ''
  },

  // Paginación (solo para saber la página actual y tamaño)
  pagination: {
    page: 1,
    pageSize: 4,
    totalPages: 1 // Se calculará basado en filteredLeads.length
  },

  // Acciones

  /**
   * Actualiza los filtros manteniendo el estado anterior
   */
  setFilters: newFilters => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      // Reset de paginación al cambiar filtros
      pagination: { ...state.pagination, page: 1 }
    }));
    // Aplicar filtros a los datos existentes sin re-fetch (a menos que sea necesario)
    get().applyFiltersAndPagination();
  },

  /**
   * Actualiza la paginación manteniendo el estado anterior
   */
  setPagination: newPagination => {
    set(state => ({
      pagination: { ...state.pagination, ...newPagination }
      // No necesitamos recargar datos aquí si la paginación es en cliente
    }));
    // Opcionalmente, si quisiéramos que el store aún controle el slice:
    // get().applyFiltersAndPagination();
  },

  /**
   * Carga los datos iniciales (mock)
   */
  fetchInitialLeads: async () => {
    set({ isLoading: true, hasError: false, errorMessage: '' });
    try {
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 300));
      // Siempre cargamos todos los datos mock para asegurar que haya datos para visualizar
      set({ allLeads: [...mockLeads], isLoading: false });
      get().applyFiltersAndPagination(); // Aplicar filtros iniciales
    } catch (error) {
      console.error('Error fetching initial leads:', error);
      set({
        isLoading: false,
        hasError: true,
        errorMessage: 'Error al cargar los leads iniciales.'
      });
    }
  },

  /**
   * Aplica filtros y actualiza el estado de leads y paginación
   * Esta función NO hace el slice para paginar
   */
  applyFiltersAndPagination: () => {
    const { filters, pagination, allLeads } = get();

    let filteredLeads = [...allLeads];

    // Filtro por estado
    if (filters.status !== 'all') {
      filteredLeads = filteredLeads.filter(
        lead => lead.status === filters.status
      );
    }

    // Filtro por tipo de usuario
    if (filters.userType !== 'all') {
      filteredLeads = filteredLeads.filter(
        lead => lead.userType === filters.userType
      );
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLeads = filteredLeads.filter(
        lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
          (lead.notes && lead.notes.toLowerCase().includes(searchLower))
      );
    }

    const totalLeads = filteredLeads.length;
    const totalPages = Math.max(1, Math.ceil(totalLeads / pagination.pageSize));
    const currentPage = Math.min(pagination.page, totalPages);

    set({
      leads: filteredLeads, // Establece TODOS los leads filtrados
      totalLeads: totalLeads,
      pagination: {
        ...get().pagination,
        page: currentPage, // Asegurar que la página sea válida
        totalPages: totalPages
      },
      isLoading: false // Asegurarse de quitar isLoading si se llama después de fetch
    });
  },

  /**
   * Limpia todos los filtros y resetea la paginación
   */
  resetFilters: () => {
    set({
      filters: {
        status: 'all',
        userType: 'all',
        search: ''
      },
      pagination: {
        ...get().pagination,
        page: 1
      }
    });
    get().applyFiltersAndPagination(); // Aplicar reset
  }
}));
