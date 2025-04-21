/**
 * Hook para manejo de actualizaciones automáticas del dashboard
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse
 * exclusivamente de la lógica de actualización
 */

import { useEffect, useRef } from 'react';
import { useDashboardStore } from '../store/dashboard-store';

/**
 * Hook que maneja la actualización automática de datos del dashboard
 * @param {boolean} autoRefresh - Si debe refrescar automáticamente (default: true)
 * @returns {Object} - Objeto con funciones para control de refresco
 */
export function useDashboardRefresh(autoRefresh = true) {
  const refreshInterval = useDashboardStore(
    state => state.viewPreferences.refreshInterval
  );
  const refreshDashboard = useDashboardStore(state => state.refreshDashboard);
  const initializeDashboard = useDashboardStore(
    state => state.initializeDashboard
  );
  const isAnyLoading = useDashboardStore(state =>
    Object.values(state.isLoading).some(loading => loading)
  );
  const refreshTimerRef = useRef(null);

  // Inicializar datos al montar el componente
  useEffect(() => {
    initializeDashboard();

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [initializeDashboard]);

  // Configurar intervalo de actualización
  useEffect(() => {
    if (!autoRefresh) return;

    // Limpiar intervalos existentes
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Establecer nuevo intervalo
    const intervalMs = refreshInterval * 60 * 1000; // convertir minutos a ms
    refreshTimerRef.current = setInterval(() => {
      // Solo refrescar si no hay cargas activas
      if (!isAnyLoading) {
        refreshDashboard();
      }
    }, intervalMs);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, refreshDashboard, isAnyLoading]);

  // Función para forzar actualización
  const forceRefresh = () => {
    if (!isAnyLoading) {
      refreshDashboard();
    }
  };

  return {
    forceRefresh,
    isLoading: isAnyLoading
  };
}
