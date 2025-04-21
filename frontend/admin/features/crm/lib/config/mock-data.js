/**
 * Datos mock para la funcionalidad de leads
 * Estos datos se utilizan para desarrollo y testing mientras no
 * exista una conexión con la API real
 *
 * Nota: La configuración de UI (colores, iconos, etc) ha sido movida a ui-config.js
 */

/**
 * Leads de ejemplo para desarrollo
 * Representan distintos tipos de leads en diferentes estados del embudo de ventas
 */
export const mockLeads = [
  {
    id: 'LD-001',
    name: 'Carolina Mendoza',
    email: 'carolina@empresa.com',
    phone: '+34 612 345 678',
    company: 'Particular',
    position: 'Madre',
    source: 'Formulario Landing',
    status: 'nuevo',
    userType: 'persona',
    createdAt: '2023-11-16T10:30:00',
    updatedAt: '2023-11-16T10:30:00',
    lastContact: null,
    notes: 'Interesada en programa para su hijo con TDAH',
    service: {
      professional: false,
      chatbot: true,
      estudiante: true,
      calendario: false
    },
    tags: ['Padre/Madre', 'TDAH', 'Landing Promoción']
  },
  {
    id: 'LD-002',
    name: 'Instituto Educativo Norte',
    email: 'contacto@instituto-norte.edu',
    phone: '+34 912 345 678',
    company: 'Instituto Educativo Norte',
    position: 'Director',
    source: 'WhatsApp',
    status: 'proceso',
    userType: 'empresa',
    createdAt: '2023-11-15T14:20:00',
    updatedAt: '2023-11-15T16:45:00',
    lastContact: '2023-11-15T16:45:00',
    notes: 'Solicitan información sobre licencias para 15 estudiantes',
    service: {
      professional: false,
      chatbot: false,
      estudiante: true,
      calendario: true
    },
    tags: ['Institución', 'Licencia Múltiple', 'Colegio']
  },
  {
    id: 'LD-003',
    name: 'Dr. Fernando Ruiz',
    email: 'fruiz@clinica.com',
    phone: '+34 634 567 890',
    company: 'Clínica Neurológica Central',
    position: 'Psicólogo',
    source: 'Referido',
    status: 'cliente',
    userType: 'profesional',
    createdAt: '2023-11-14T09:15:00',
    updatedAt: '2023-11-16T11:30:00',
    lastContact: '2023-11-16T11:30:00',
    notes: 'Psicólogo interesado en implementar en su consulta',
    service: {
      professional: true,
      chatbot: true,
      estudiante: false,
      calendario: true
    },
    tags: ['Profesional', 'Psicólogo', 'Referido']
  },
  {
    id: 'LD-004',
    name: 'Marta Alonso',
    email: 'marta.alonso@gmail.com',
    phone: '+34 645 678 901',
    company: 'Particular',
    position: 'Madre',
    source: 'Google',
    status: 'proceso',
    userType: 'persona',
    createdAt: '2023-11-13T16:40:00',
    updatedAt: '2023-11-15T09:00:00',
    lastContact: '2023-11-15T09:00:00',
    notes: 'Programada demo para el próximo martes',
    service: {
      professional: false,
      chatbot: true,
      estudiante: true,
      calendario: false
    },
    tags: ['Padre/Madre', 'Demo Programada']
  },
  {
    id: 'LD-005',
    name: 'Colegio San Ignacio',
    email: 'direccion@sanignacio.edu',
    phone: '+34 913 456 789',
    company: 'Colegio San Ignacio',
    position: 'Director',
    source: 'Evento Educativo',
    status: 'nuevo',
    userType: 'empresa',
    createdAt: '2023-11-12T11:20:00',
    updatedAt: '2023-11-12T11:20:00',
    lastContact: null,
    notes:
      'Director interesado en programa piloto para el departamento de orientación',
    service: {
      professional: true,
      chatbot: false,
      estudiante: true,
      calendario: true
    },
    tags: ['Institución', 'Colegio', 'Programa Piloto']
  },
  {
    id: 'LD-006',
    name: 'Jorge Sánchez',
    email: 'jorge.sanchez@outlook.com',
    phone: '+34 656 789 012',
    company: 'Particular',
    position: 'Padre',
    source: 'Recomendación',
    status: 'nuevo',
    userType: 'persona',
    createdAt: '2023-11-11T15:10:00',
    updatedAt: '2023-11-11T17:45:00',
    lastContact: '2023-11-11T17:45:00',
    notes: 'Padre buscando soluciones para su hija de 9 años',
    service: {
      professional: false,
      chatbot: true,
      estudiante: true,
      calendario: false
    },
    tags: ['Padre/Madre', 'Recomendación']
  },
  {
    id: 'LD-007',
    name: 'Dra. Isabel Márquez',
    email: 'imarquez@clinicapediatrica.com',
    phone: '+34 677 890 123',
    company: 'Clínica Pediátrica Márquez',
    position: 'Pediatra',
    source: 'LinkedIn',
    status: 'cliente',
    userType: 'profesional',
    createdAt: '2023-11-10T09:30:00',
    updatedAt: '2023-11-14T14:20:00',
    lastContact: '2023-11-14T14:20:00',
    notes: 'Pediatra especializada en trastornos del neurodesarrollo',
    service: {
      professional: true,
      chatbot: false,
      estudiante: false,
      calendario: true
    },
    tags: ['Profesional', 'Pediatra', 'Especialista']
  },
  {
    id: 'LD-008',
    name: 'Centro Terapéutico Avanza',
    email: 'info@centroavanza.com',
    phone: '+34 918 901 234',
    company: 'Centro Terapéutico Avanza',
    position: 'Director',
    source: 'Email Marketing',
    status: 'proceso',
    userType: 'empresa',
    createdAt: '2023-11-09T14:50:00',
    updatedAt: '2023-11-16T09:15:00',
    lastContact: '2023-11-16T09:15:00',
    notes: 'Centro con 12 terapeutas, interesados en licencia múltiple',
    service: {
      professional: true,
      chatbot: true,
      estudiante: true,
      calendario: true
    },
    tags: ['Institución', 'Centro Terapéutico', 'Licencia Múltiple']
  }
];

/**
 * Historia de contactos mock para un lead específico
 */
export const mockContactHistory = [
  {
    id: 'contact-001',
    leadId: 'LD-001',
    type: 'email',
    date: '2023-11-16T11:30:00',
    user: 'María García',
    subject: 'Información sobre PlayAttention',
    content: 'Envío de folleto informativo y precios',
    outcome: 'Enviado'
  },
  {
    id: 'contact-002',
    leadId: 'LD-001',
    type: 'call',
    date: '2023-11-17T14:45:00',
    user: 'Carlos Pérez',
    subject: 'Llamada de seguimiento inicial',
    content:
      'Se explicaron las características principales del programa y se resolvieron dudas iniciales',
    outcome: 'Interesado - Solicita más información'
  },
  {
    id: 'contact-003',
    leadId: 'LD-001',
    type: 'email',
    date: '2023-11-18T09:15:00',
    user: 'María García',
    subject: 'Material adicional solicitado',
    content: 'Envío de estudios de caso y testimonios de usuarios',
    outcome: 'Enviado'
  },
  {
    id: 'contact-004',
    leadId: 'LD-001',
    type: 'meeting',
    date: '2023-11-20T16:00:00',
    user: 'Carlos Pérez',
    subject: 'Demo del producto',
    content: 'Demostración online del funcionamiento de la plataforma',
    outcome: 'Muy interesado - Evaluando opciones'
  },
  {
    id: 'contact-005',
    leadId: 'LD-001',
    type: 'call',
    date: '2023-11-23T10:30:00',
    user: 'Carlos Pérez',
    subject: 'Seguimiento post-demo',
    content:
      'Llamada para resolver dudas adicionales y discutir próximos pasos',
    outcome: 'Solicitará presupuesto formal'
  }
];
