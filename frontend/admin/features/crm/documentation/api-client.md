# API Client - CRM Module

## Descripción

Este documento detalla la implementación refactorizada del cliente API para el módulo CRM. Se aplicó el Principio de Responsabilidad Única (SRP) para mejorar la mantenibilidad, escalabilidad y testabilidad del código.

## Estructura

La API se ha dividido en archivos individuales por función, siguiendo el patrón SRP:

```
frontend/admin/features/crm/lib/api/
├── config.js            # Configuración y utilidades compartidas
├── createEngagement.js  # Crear contacto
├── createLead.js        # Crear lead
├── deleteLead.js        # Eliminar lead
├── getLeadById.js       # Obtener lead específico
├── getLeadEngagements.js # Obtener contactos de un lead
├── getLeads.js          # Obtener todos los leads
├── index.js             # Archivo barril para exportaciones
└── updateLead.js        # Actualizar lead
```

## Configuración Compartida

El archivo `config.js` centraliza la configuración y las funciones auxiliares:

- `API_URL`: URL base de la API
- `commonHeaders`: Headers comunes para las peticiones
- `mapUserTypeToService()`: Mapea tipos de usuario a servicios del backend
- `mapSourceToBackend()`: Mapea fuentes de leads al formato del backend
- `handleResponseError()`: Procesamiento consistente de errores API

## Métodos API

### Leads

#### getLeads()

Obtiene todos los leads.

```javascript
import { getLeads } from '@/features/crm/lib/api';
const leads = await getLeads();
```

#### getLeadById(id)

Obtiene un lead específico por ID.

```javascript
import { getLeadById } from '@/features/crm/lib/api';
const lead = await getLeadById('123');
```

#### createLead(formData)

Crea un nuevo lead.

```javascript
import { createLead } from '@/features/crm/lib/api';
const newLead = await createLead({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  userType: 'persona'
});
```

#### updateLead(id, formData)

Actualiza un lead existente.

```javascript
import { updateLead } from '@/features/crm/lib/api';
const updated = await updateLead('123', {
  status: 'Cliente'
});
```

#### deleteLead(id)

Elimina un lead.

```javascript
import { deleteLead } from '@/features/crm/lib/api';
await deleteLead('123');
```

### Engagements (Contactos)

#### getLeadEngagements(leadId)

Obtiene los contactos de un lead específico.

```javascript
import { getLeadEngagements } from '@/features/crm/lib/api';
const contacts = await getLeadEngagements('123');
```

#### createEngagement(contactData)

Crea un nuevo contacto para un lead.

```javascript
import { createEngagement } from '@/features/crm/lib/api';
await createEngagement({
  leadId: '123',
  type: 'email',
  notes: 'Contacto inicial'
});
```

## Compatibilidad

Para garantizar la compatibilidad con código existente, se mantienen las exportaciones originales a través del archivo barril `index.js`:

```javascript
// Forma antigua (compatibilidad)
import { leadsApi, engagementsApi } from '@/features/crm/lib/api';
await leadsApi.getLeads();

// Forma nueva (recomendada)
import { getLeads } from '@/features/crm/lib/api';
await getLeads();
```

## Ventajas de la Refactorización

1. **Mejor mantenibilidad**: Cada archivo tiene una sola responsabilidad
2. **Código más limpio**: Separación clara de funcionalidades
3. **Mejor escalabilidad**: Fácil agregar nuevas funciones sin afectar las existentes
4. **Mejor testabilidad**: Cada función puede probarse de forma aislada
5. **Compatibilidad con código existente**: No rompe la integración con componentes existentes
