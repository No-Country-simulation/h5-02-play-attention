/**
 * Configuración de UI para la feature de leads
 * Centraliza todos los mapeos de estilos y variantes
 * Siguiendo el sistema de diseño del proyecto
 */

/**
 * Configuración de estados de leads
 * Cada estado tiene una variante de Badge, clase CSS y etiqueta
 */
export const leadStatusConfig = {
  nuevo: {
    variant: 'outline',
    className: 'bg-green-50 text-green-700 border-green-200',
    icon: 'user-plus',
    label: 'Nuevo'
  },
  proceso: {
    variant: 'outline',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'message-square',
    label: 'Proceso'
  },
  cliente: {
    variant: 'outline',
    className: 'bg-success-light text-success border-success',
    icon: 'user-check',
    label: 'Cliente'
  }
};

// Mapeo de tipo de contacto a variantes de UI (para historial de contactos)
export const contactTypeConfig = {
  email: {
    variant: 'outline',
    className: 'bg-info-light text-info border-info',
    icon: 'mail',
    label: 'Email'
  },
  call: {
    variant: 'outline',
    className: 'bg-leads-light text-leads border-leads',
    icon: 'message-circle',
    label: 'WhatsApp'
  },
  meeting: {
    variant: 'outline',
    className: 'bg-content-light text-content border-content',
    icon: 'users',
    label: 'Reunión'
  },
  message: {
    variant: 'outline',
    className: 'bg-tickets-light text-tickets border-tickets',
    icon: 'message-circle',
    label: 'Mensaje'
  },
  note: {
    variant: 'outline',
    className: 'bg-neutral-light text-neutral border-neutral',
    icon: 'file-text',
    label: 'Nota'
  }
};

// Versiones simplificadas para uso en opciones de selección
export const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'nuevo', label: 'Nuevos' },
  { value: 'proceso', label: 'Proceso' },
  { value: 'cliente', label: 'Clientes' }
];

export const typeOptions = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'persona', label: 'Persona' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'profesional', label: 'Profesional' }
];

// Configuración para los tipos de usuario de leads
export const leadUserTypeConfig = {
  profesional: {
    variant: 'outline',
    className: 'bg-background text-foreground border-border',
    label: 'Profesional',
    description: 'Psicólogos, terapeutas, etc.'
  },
  persona: {
    variant: 'outline',
    className: 'bg-background text-foreground border-border',
    label: 'Persona',
    description: 'Padres, madres, usuarios finales'
  },
  individual: {
    variant: 'outline',
    className: 'bg-background text-foreground border-border',
    label: 'Persona',
    description: 'Padres, madres, usuarios finales'
  },
  empresa: {
    variant: 'outline',
    className: 'bg-background text-foreground border-border',
    label: 'Empresa',
    description: 'Colegios, centros, instituciones'
  }
};

// Configuración para tipos de contacto
export const leadContactTypeConfig = {
  email: {
    label: 'Email',
    icon: 'mail',
    className: 'text-blue-600'
  },
  llamada: {
    label: 'WhatsApp',
    icon: 'message-circle',
    className: 'text-green-600'
  },
  reunión: {
    label: 'Reunión',
    icon: 'calendar',
    className: 'text-purple-600'
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: 'message-circle',
    className: 'text-green-600'
  },
  demo: {
    label: 'Demo',
    icon: 'presentation',
    className: 'text-amber-600'
  },
  nota: {
    label: 'Nota',
    icon: 'clipboard',
    className: 'text-gray-600'
  },
  tarea: {
    label: 'Tarea',
    icon: 'check-square',
    className: 'text-indigo-600'
  }
};

// Fuentes de leads
export const leadSourceOptions = [
  'Sitio web',
  'Formulario Landing',
  'WhatsApp',
  'Redes sociales',
  'Recomendación',
  'Otro'
];

// Tipos de usuario
export const leadUserTypeOptions = ['profesional', 'persona', 'empresa'];

// Opciones de estado
export const leadStatusOptions = Object.keys(leadStatusConfig);

// Opciones de servicios
export const leadServiceOptions = [
  { id: 'professional', label: 'Profesional' },
  { id: 'chatbot', label: 'Chatbot' },
  { id: 'estudiante', label: 'Estudiante' },
  { id: 'calendario', label: 'Calendario' }
];
