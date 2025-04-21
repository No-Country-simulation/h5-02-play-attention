# Dashboard Feature

Este módulo contiene todos los componentes, servicios y configuraciones relacionados con el panel de control de la aplicación.

## Estructura

```
dashboard/
├── index.js              # Exportaciones principales del módulo
├── components/           # Componentes UI del dashboard
│   ├── Dashboard.jsx     # Componente principal
│   ├── MetricCard.jsx    # Tarjeta de métricas
│   ├── ActionCard.jsx    # Tarjeta de acciones rápidas
│   ├── AlertCard.jsx     # Tarjeta de alertas
│   └── ...               # Otros componentes
├── lib/
│   ├── adapters/         # Adaptadores para transformar datos de API
│   ├── config/           # Configuraciones y datos mock
│   │   └── mockedData.js # Datos de prueba para desarrollo
│   ├── hooks/            # Hooks personalizados
│   │   └── useDashboardRefresh.js
│   ├── services/         # Servicios para obtener datos
│   │   └── api.js        # Servicio API para el dashboard
│   └── store/            # Estado global con Zustand
│       └── dashboard-store.js
```

## Uso

### Componentes

Para importar los componentes del dashboard:

```javascript
import { Dashboard, MetricCard, ActionCard } from 'features/dashboard';
```

### Estado global con Zustand

El dashboard utiliza Zustand para manejar el estado global compartido entre componentes:

```javascript
import { useDashboardStore } from 'features/dashboard';

function MyComponent() {
  // Acceder a datos
  const metrics = useDashboardStore(state => state.metrics);
  const alerts = useDashboardStore(state => state.alerts);

  // Acceder a estados de carga
  const isLoading = useDashboardStore(state => state.isLoading);

  // Acceder a preferencias de visualización
  const viewPreferences = useDashboardStore(state => state.viewPreferences);

  // Acceder a acciones
  const fetchMetrics = useDashboardStore(state => state.fetchMetrics);
  const setActiveTab = useDashboardStore(state => state.setActiveTab);

  // Inicializar todos los datos
  const initializeDashboard = useDashboardStore(
    state => state.initializeDashboard
  );

  // ...
}
```

### Actualización automática

Para implementar actualizaciones automáticas de datos en un componente:

```javascript
import { useDashboardRefresh } from 'features/dashboard';

function MyComponent() {
  // Inicia actualización automática según el intervalo configurado
  const { forceRefresh, isLoading } = useDashboardRefresh();

  return (
    <button onClick={forceRefresh} disabled={isLoading}>
      Actualizar datos
    </button>
  );
}
```

### Servicios API

El módulo proporciona las siguientes funciones para obtener datos del dashboard:

- `fetchDashboardMetrics()` - Obtiene métricas principales
- `fetchDashboardAlerts()` - Obtiene alertas activas
- `fetchQuickActions()` - Obtiene acciones rápidas disponibles
- `fetchRecentLeads()` - Obtiene leads recientes
- `fetchRecentTickets()` - Obtiene tickets recientes
- `fetchContentActivities()` - Obtiene actividad de contenido
- `fetchCalendarActivities()` - Obtiene eventos del calendario

En modo desarrollo, estas funciones utilizan los datos mock de `mockedData.js`.
