# CRM Feature

Este módulo gestiona la funcionalidad de CRM (Customer Relationship Management) de la aplicación.

## Estructura Simplificada

La feature sigue una estructura simplificada pensada para un desarrollo ágil:

```
frontend/admin/features/crm/
├── api.js                # Centraliza todas las llamadas a la API
├── hooks/                # Hooks de React Query
│   └── useLeads.js       # Hooks para gestionar leads (mutaciones y queries)
└── components/           # Componentes UI
    └── leads/            # Componentes específicos para leads
        ├── NewLeadForm.jsx
        ├── LeadList.jsx
        ├── LeadDetail.jsx
        └── ... etc
```

## Flujo de Datos

1. El usuario interactúa con un componente (ej: `NewLeadForm.jsx`)
2. El componente llama a un hook (ej: `useCreateLead()` de `hooks/useLeads.js`)
3. El hook utiliza React Query y llama a una función de API (ej: `leadsApi.createLead()` de `api.js`)
4. La función de API:
   - Transforma los datos del formulario al formato que espera el backend
   - Realiza la petición HTTP
   - Maneja errores
   - Devuelve los datos

## Ventajas

- **Flujo directo y fácil de seguir** - Sin capas innecesarias
- **Transformación centralizada** - Las transformaciones de datos están en `api.js`
- **Manejo de estado robusto** - Gracias a React Query que se configura en `hooks/useLeads.js`
- **Componentes enfocados en UI** - Los componentes solo se preocupan por la interfaz

## Uso

### Crear un lead

```jsx
import { useCreateLead } from '../../hooks/useLeads';

function MyComponent() {
  const { mutateAsync, isPending } = useCreateLead();

  const handleSubmit = async formData => {
    try {
      await mutateAsync(formData);
      // Éxito!
    } catch (error) {
      // El error ya se muestra en un toast
    }
  };

  return (
    <button onClick={() => handleSubmit(data)} disabled={isPending}>
      {isPending ? 'Creando...' : 'Crear Lead'}
    </button>
  );
}
```

### Obtener leads

```jsx
import { useLeads } from '../../hooks/useLeads';

function LeadsList() {
  const { data: leads, isLoading, error } = useLeads();

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {leads.map(lead => (
        <li key={lead.id}>{lead.fullname}</li>
      ))}
    </ul>
  );
}
```
