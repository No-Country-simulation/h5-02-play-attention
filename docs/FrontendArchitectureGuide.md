# Guía de Arquitectura Frontend

Esta guía está pensada para nuestro equipo frontend, especialmente para quienes están comenzando. Queremos que sea clara, didáctica y con ejemplos para que todos podamos trabajar de manera consistente, siguiendo buenas prácticas.

---

## 📁 Estructura general del proyecto

Nuestro frontend está organizado principalmente bajo dos enfoques combinados:

### 1. **Screaming Architecture**
Basado en el principio de que _"el código debe gritar su intención"_, organizamos por **dominio funcional**.

Por ejemplo:
```
features/
  ├── crm/
  ├── tickets/
  └── users/
```
Cada carpeta representa una funcionalidad principal del negocio (CRM, Tickets, Usuarios).

### 2. **Feature-First**
Dentro de cada dominio, organizamos el código por tipo:
```
crm/
  ├── components/
  ├── hooks/
  ├── lib/
      ├── adapters/
      ├── config/
      ├── services/
      ├── store/
      └── utils/
```

Esto permite que todo lo que pertenece a una funcionalidad esté junto, facilitando el mantenimiento.

---

## 🔎 Carpetas y su uso

| Carpeta | Propósito |
|--------|----------|
| `components/` | Componentes visuales reutilizables dentro del feature |
| `hooks/` | Custom hooks específicos del feature |
| `lib/` | Lógica de negocio del feature |
| `lib/adapters/` | Adaptadores que transforman datos según el contexto (p. ej. preparar datos para un servicio) |
| `lib/config/` | Configuraciones específicas (constantes, enums, etc.) |
| `lib/services/` | Acceso a servicios externos o internos |
| `lib/store/` | Estado local o global del feature (ej: Zustand, Context) |
| `lib/utils/` | Utilidades auxiliares, funciones genéricas del feature |

---

## 🔗 Integración con `shared/`

La carpeta `shared/` contiene código reutilizable entre features.

```
shared/
  ├── layout/
  ├── errors/
  ├── sidebar/
  └── lib/
        ├── services/  <- servicios globales como generatePDF
        ├── utils/     <- funciones auxiliares reutilizables
```

Todo lo que esté en `shared/` debe ser **genérico y sin dependencia de ningún feature**.

---

## 🔧 Buenas prácticas y principios

### Principios SOLID (adaptados al frontend)
- **S - Responsabilidad única:** cada archivo hace una sola cosa (ej: un adapter sólo transforma datos)
- **O - Abierto/Cerrado:** el código debería poder extenderse sin romper lo existente
- **L - Sustitución de Liskov:** si un componente espera props de un tipo, debería poder usarse cualquier variante de ese tipo sin romperse
- **I - Segregación de interfaces:** componentes bien definidos, sin props innecesarias
- **D - Inversión de dependencias:** se usa inyección de servicios, evitando acoplar la UI con servicios directamente

### Clean Code
- Nombres descriptivos
- Archivos cortos y claros
- Separación de responsabilidades
- Comentarios sólo donde sea necesario (el código debe explicarse solo)

---

## 📄 Metodología sugerida para juniors

Para facilitar el desarrollo, podés seguir esta versión simplificada:

### Estructura adaptada:
```
features/
  crm/
    components/
    hooks/
    services/
    utils/
```
- No es obligatorio usar `adapters` si no es necesario.
- Podés concentrar la lógica en `services` y `utils` siempre que esté bien separada.
- `lib/` se usa si querés una estructura más completa o escalar mejor.

---

## ✅ Conclusión

Este enfoque mixto (Screaming + Feature-First) busca claridad, escalabilidad y facilidad para nuevos desarrolladores. Cada funcionalidad está bien delimitada, y el código es predecible y mantenible.

Ante cualquier duda o sugerencia, hablalo con el team. Esta guía está viva y puede evolucionar ❤️

