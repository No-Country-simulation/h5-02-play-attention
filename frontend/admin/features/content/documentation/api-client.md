# API Client - Módulo de Contenido

## Descripción

Este documento detalla la implementación del cliente API para el módulo de contenido. Se aplicó el Principio de Responsabilidad Única (SRP) para mejorar la mantenibilidad, escalabilidad y testabilidad del código.

## Estructura

La API se ha dividido en archivos individuales por función, siguiendo el patrón SRP:

```
frontend/admin/features/content/lib/api/
├── config.js            # Configuración y utilidades compartidas
├── createContent.js     # Crear contenido
├── deleteContent.js     # Eliminar contenido
├── getContentById.js    # Obtener contenido específico
├── getContents.js       # Obtener todos los contenidos
├── index.js             # Archivo barril para exportaciones
└── updateContent.js     # Actualizar contenido
```

## Configuración Compartida

El archivo `config.js` centraliza la configuración y las funciones auxiliares:

- `API_URL`: URL base de la API
- `commonHeaders`: Headers comunes para las peticiones
- `mapContentTypeToBackend()`: Mapea tipos de contenido al formato del backend
- `mapContentTypeToFrontend()`: Mapea tipos de contenido al formato del frontend
- `mapStatusToBackend()`: Mapea estados de contenido al formato del backend
- `mapStatusToFrontend()`: Mapea estados de contenido al formato del frontend
- `handleResponseError()`: Procesamiento consistente de errores API

## Métodos API

### Contents (Contenidos)

#### getContents()

Obtiene todos los contenidos.

```javascript
import { getContents } from '@/features/content/lib/api';
const contents = await getContents();
```

#### getContentById(id)

Obtiene un contenido específico por ID.

```javascript
import { getContentById } from '@/features/content/lib/api';
const content = await getContentById('123');
```

#### createContent(formData)

Crea un nuevo contenido.

```javascript
import { createContent } from '@/features/content/lib/api';
const newContent = await createContent({
  title: 'Mi nuevo contenido',
  type: 'Artículo',
  content: 'Contenido del artículo',
  category: 'Tutoriales',
  status: 'Borrador'
});
```

#### updateContent(id, formData)

Actualiza un contenido existente.

```javascript
import { updateContent } from '@/features/content/lib/api';
const updated = await updateContent('123', {
  title: 'Título actualizado',
  status: 'Publicado'
});
```

#### deleteContent(id)

Elimina un contenido.

```javascript
import { deleteContent } from '@/features/content/lib/api';
await deleteContent('123');
```

## Adaptador de Datos

Se incluye un adaptador para transformar los datos del backend al formato que necesitan los componentes:

```javascript
import {
  contentsAdapter,
  contentAdapter
} from '@/features/content/lib/adapters';

// Para una lista de contenidos
const formattedContents = contentsAdapter(apiContents);

// Para un único contenido
const formattedContent = contentAdapter(apiContent);
```

## Hooks de React Query

Para facilitar la gestión del estado y caché, se han creado hooks especializados:

```javascript
import {
  useContents,
  useContent,
  useCreateContent,
  useUpdateContent,
  useDeleteContent
} from '@/features/content/lib/hooks';

// Obtener todos los contenidos
const { data: contents, isLoading } = useContents();

// Obtener un contenido específico
const { data: content } = useContent(id);

// Crear un contenido
const createMutation = useCreateContent();
await createMutation.mutateAsync(formData);

// Actualizar un contenido
const updateMutation = useUpdateContent(id);
await updateMutation.mutateAsync(formData);

// Eliminar un contenido
const deleteMutation = useDeleteContent();
await deleteMutation.mutateAsync(id);
```

## Ventajas de la Implementación

1. **Mejor mantenibilidad**: Cada archivo tiene una sola responsabilidad
2. **Código más limpio**: Separación clara de funcionalidades
3. **Mejor escalabilidad**: Fácil agregar nuevas funciones sin afectar las existentes
4. **Mejor testabilidad**: Cada función puede probarse de forma aislada
5. **Gestión de estado optimizada**: Gracias a React Query que se encarga de la caché y revalidación
