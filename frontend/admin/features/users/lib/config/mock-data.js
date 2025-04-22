/**
 * Datos mockeados para la feature de usuarios
 * Se utilizan para desarrollo y pruebas
 */

// Usuarios de ejemplo
export const mockUsers = [
  {
    id: 1,
    name: 'Ana García',
    email: 'ana.garcia@ejemplo.com',
    role: 'Usuario',
    status: 'active',
    lastLogin: '2023-11-28T10:30:00',
    createdAt: '2023-01-15T08:00:00'
  },
  {
    id: 2,
    name: 'Carlos López',
    email: 'carlos.lopez@ejemplo.com',
    role: 'Comercial',
    status: 'active',
    lastLogin: '2023-11-27T14:20:00',
    createdAt: '2023-02-10T09:15:00'
  },
  {
    id: 3,
    name: 'María Rodríguez',
    email: 'maria.rodriguez@ejemplo.com',
    role: 'Usuario',
    status: 'inactive',
    lastLogin: '2023-10-15T11:45:00',
    createdAt: '2023-03-05T10:30:00'
  },
  {
    id: 4,
    name: 'Juan Martínez',
    email: 'juan.martinez@ejemplo.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2023-11-28T09:10:00',
    createdAt: '2023-01-20T11:00:00'
  },
  {
    id: 5,
    name: 'Laura Sánchez',
    email: 'laura.sanchez@ejemplo.com',
    role: 'Comercial',
    status: 'pending',
    lastLogin: null,
    createdAt: '2023-11-25T14:20:00'
  }
];

// Estadísticas de usuarios
export const userStats = {
  total: 256,
  active: 210,
  inactive: 35,
  pending: 11,
  newThisMonth: 24
};
