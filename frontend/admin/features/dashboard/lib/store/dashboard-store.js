/**
 * Dashboard Store
 * Estado global para el Dashboard utilizando Zustand
 * Sigue el principio de Responsabilidad Única (SRP) y
 * mantiene estados compartidos entre componentes
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchDashboardMetrics,
  fetchDashboardAlerts,
  fetchQuickActions,
  fetchRecentLeads,
  fetchRecentTickets,
  fetchContentActivities,
  fetchCalendarActivities
} from '../services/api';

import {
  metricsAdapter,
  alertsAdapter,
  actionsAdapter,
  leadsAdapter,
  ticketsAdapter,
  contentActivitiesAdapter,
  calendarActivitiesAdapter
} from '../adapters';

/**
 * Store de Zustand para el Dashboard
 * Centraliza la gestión de estados y datos para todos los componentes del dashboard
 */
export const useDashboardStore = create(
  persist(
    (set, get) => ({
      // Estados de visualización y preferencias
      viewPreferences: {
        alertViewMode: 'list', // 'list' o 'grid'
        visibleAlerts: 4,
        activeTab: 'overview',
        dateRange: '7d', // '1d', '7d', '30d', '90d'
        refreshInterval: 5 // minutos
      },

      // Datos del dashboard
      metrics: [],
      alerts: [],
      quickActions: [],
      recentLeads: [],
      recentTickets: [],
      contentActivities: [],
      calendarActivities: [],

      // Estados de carga
      isLoading: {
        metrics: false,
        alerts: false,
        quickActions: false,
        recentLeads: false,
        recentTickets: false,
        contentActivities: false,
        calendarActivities: false
      },

      // Control de errores
      errors: {
        metrics: null,
        alerts: null,
        quickActions: null,
        recentLeads: null,
        recentTickets: null,
        contentActivities: null,
        calendarActivities: null
      },

      // Timestamp de última actualización
      lastUpdated: {
        metrics: null,
        alerts: null,
        quickActions: null,
        recentLeads: null,
        recentTickets: null,
        contentActivities: null,
        calendarActivities: null
      },

      // Setters para preferencias de visualización
      setAlertViewMode: mode =>
        set(state => ({
          viewPreferences: {
            ...state.viewPreferences,
            alertViewMode: mode
          }
        })),

      setVisibleAlerts: count =>
        set(state => ({
          viewPreferences: {
            ...state.viewPreferences,
            visibleAlerts: count
          }
        })),

      setActiveTab: tab =>
        set(state => ({
          viewPreferences: {
            ...state.viewPreferences,
            activeTab: tab
          }
        })),

      setDateRange: range =>
        set(state => ({
          viewPreferences: {
            ...state.viewPreferences,
            dateRange: range
          }
        })),

      setRefreshInterval: minutes =>
        set(state => ({
          viewPreferences: {
            ...state.viewPreferences,
            refreshInterval: minutes
          }
        })),

      // Acciones para cargar datos
      fetchMetrics: async () => {
        const { isLoading } = get();

        // Evitar múltiples solicitudes simultáneas
        if (isLoading.metrics) return;

        set(state => ({
          isLoading: { ...state.isLoading, metrics: true },
          errors: { ...state.errors, metrics: null }
        }));

        try {
          const apiData = await fetchDashboardMetrics();
          const metrics = metricsAdapter(apiData);

          set(state => ({
            metrics,
            lastUpdated: {
              ...state.lastUpdated,
              metrics: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            errors: {
              ...state.errors,
              metrics: error.message || 'Error al cargar métricas'
            }
          }));
        } finally {
          set(state => ({
            isLoading: { ...state.isLoading, metrics: false }
          }));
        }
      },

      fetchAlerts: async () => {
        const { isLoading } = get();

        if (isLoading.alerts) return;

        set(state => ({
          isLoading: { ...state.isLoading, alerts: true },
          errors: { ...state.errors, alerts: null }
        }));

        try {
          const apiData = await fetchDashboardAlerts();
          const alerts = alertsAdapter(apiData);

          set(state => ({
            alerts,
            lastUpdated: {
              ...state.lastUpdated,
              alerts: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            errors: {
              ...state.errors,
              alerts: error.message || 'Error al cargar alertas'
            }
          }));
        } finally {
          set(state => ({
            isLoading: { ...state.isLoading, alerts: false }
          }));
        }
      },

      fetchQuickActions: async () => {
        const { isLoading } = get();

        if (isLoading.quickActions) return;

        set(state => ({
          isLoading: { ...state.isLoading, quickActions: true },
          errors: { ...state.errors, quickActions: null }
        }));

        try {
          const apiData = await fetchQuickActions();
          const quickActions = actionsAdapter(apiData);

          set(state => ({
            quickActions,
            lastUpdated: {
              ...state.lastUpdated,
              quickActions: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            errors: {
              ...state.errors,
              quickActions: error.message || 'Error al cargar acciones rápidas'
            }
          }));
        } finally {
          set(state => ({
            isLoading: { ...state.isLoading, quickActions: false }
          }));
        }
      },

      fetchRecentLeads: async (limit = 5) => {
        const { isLoading } = get();

        if (isLoading.recentLeads) return;

        set(state => ({
          isLoading: { ...state.isLoading, recentLeads: true },
          errors: { ...state.errors, recentLeads: null }
        }));

        try {
          const apiData = await fetchRecentLeads(limit);
          const recentLeads = leadsAdapter(apiData);

          set(state => ({
            recentLeads,
            lastUpdated: {
              ...state.lastUpdated,
              recentLeads: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            errors: {
              ...state.errors,
              recentLeads: error.message || 'Error al cargar leads recientes'
            }
          }));
        } finally {
          set(state => ({
            isLoading: { ...state.isLoading, recentLeads: false }
          }));
        }
      },

      fetchRecentTickets: async (limit = 5) => {
        const { isLoading } = get();

        if (isLoading.recentTickets) return;

        set(state => ({
          isLoading: { ...state.isLoading, recentTickets: true },
          errors: { ...state.errors, recentTickets: null }
        }));

        try {
          const apiData = await fetchRecentTickets(limit);
          const recentTickets = ticketsAdapter(apiData);

          set(state => ({
            recentTickets,
            lastUpdated: {
              ...state.lastUpdated,
              recentTickets: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            errors: {
              ...state.errors,
              recentTickets:
                error.message || 'Error al cargar tickets recientes'
            }
          }));
        } finally {
          set(state => ({
            isLoading: { ...state.isLoading, recentTickets: false }
          }));
        }
      },

      fetchContentActivities: async (limit = 4) => {
        const { isLoading } = get();

        if (isLoading.contentActivities) return;

        set(state => ({
          isLoading: { ...state.isLoading, contentActivities: true },
          errors: { ...state.errors, contentActivities: null }
        }));

        try {
          const apiData = await fetchContentActivities(limit);
          const contentActivities = contentActivitiesAdapter(apiData);

          set(state => ({
            contentActivities,
            lastUpdated: {
              ...state.lastUpdated,
              contentActivities: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            errors: {
              ...state.errors,
              contentActivities:
                error.message || 'Error al cargar actividades de contenido'
            }
          }));
        } finally {
          set(state => ({
            isLoading: { ...state.isLoading, contentActivities: false }
          }));
        }
      },

      fetchCalendarActivities: async (year, month) => {
        const { isLoading } = get();

        if (isLoading.calendarActivities) return;

        set(state => ({
          isLoading: { ...state.isLoading, calendarActivities: true },
          errors: { ...state.errors, calendarActivities: null }
        }));

        try {
          const apiData = await fetchCalendarActivities(year, month);
          const calendarActivities = calendarActivitiesAdapter(apiData);

          set(state => ({
            calendarActivities,
            lastUpdated: {
              ...state.lastUpdated,
              calendarActivities: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            errors: {
              ...state.errors,
              calendarActivities:
                error.message || 'Error al cargar actividades del calendario'
            }
          }));
        } finally {
          set(state => ({
            isLoading: { ...state.isLoading, calendarActivities: false }
          }));
        }
      },

      // Acción para inicializar todos los datos
      initializeDashboard: async () => {
        const {
          fetchMetrics,
          fetchAlerts,
          fetchQuickActions,
          fetchRecentLeads,
          fetchRecentTickets,
          fetchContentActivities
        } = get();

        // Iniciar todas las cargas en paralelo
        await Promise.all([
          fetchMetrics(),
          fetchAlerts(),
          fetchQuickActions(),
          fetchRecentLeads(),
          fetchRecentTickets(),
          fetchContentActivities()
        ]);

        // El calendario se carga con el mes actual
        const now = new Date();
        fetchCalendarActivities(now.getFullYear(), now.getMonth() + 1);
      },

      // Acción para refrescar datos
      refreshDashboard: async () => {
        const { initializeDashboard } = get();
        await initializeDashboard();
      }
    }),
    {
      name: 'dashboard-storage', // Nombre para persistencia en localStorage
      partialize: state => ({
        viewPreferences: state.viewPreferences // Solo persistir preferencias de visualización
      })
    }
  )
);
