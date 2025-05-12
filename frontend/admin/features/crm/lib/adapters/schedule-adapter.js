/**
 * Adaptador para convertir los datos de reuniones entre el formato de la API y el cliente
 */

/**
 * Convierte una reunión del formato de la API al formato del cliente
 * @param {Object} apiSchedule - Datos de la reunión en formato API
 * @returns {Object} Datos de la reunión en formato cliente
 */
export const apiToClientSchedule = apiSchedule => {
  if (!apiSchedule) return null;

  try {
    // Asegurar que tenemos un ID válido
    const id = apiSchedule.id || apiSchedule._id;
    if (!id) {
      console.warn('Advertencia: reunión sin ID', apiSchedule);
    }

    // El backend puede enviar la fecha como date o startTime
    const meetingDate =
      apiSchedule.date || apiSchedule.startTime || new Date().toISOString();

    // El backend puede enviar el ID del lead como leadId o lead
    const leadId =
      apiSchedule.leadId ||
      (apiSchedule.lead && apiSchedule.lead._id) ||
      (typeof apiSchedule.lead === 'string' ? apiSchedule.lead : '');

    // Extraer nombre del lead que puede venir en diferentes estructuras
    let leadName = '';
    if (apiSchedule.leadName) {
      // Si ya viene leadName directamente
      leadName = apiSchedule.leadName;
    } else if (apiSchedule.client) {
      // Si viene como client (compatibilidad con versiones anteriores)
      leadName = apiSchedule.client;
    } else if (apiSchedule.lead) {
      // Si lead es un objeto con fullname o email
      if (typeof apiSchedule.lead === 'object') {
        leadName =
          apiSchedule.lead.fullname ||
          apiSchedule.lead.name ||
          apiSchedule.lead.email ||
          '';
      }
    }

    // El backend puede enviar la ubicación como location o place
    const location = apiSchedule.location || apiSchedule.place || '';

    return {
      id: id,
      title: apiSchedule.title || '',
      date: meetingDate,
      endTime: apiSchedule.endTime || null,
      duration: apiSchedule.duration?.toString() || '30',
      leadId: leadId,
      leadName: leadName,
      location: location,
      description: apiSchedule.description || '',
      status: apiSchedule.status || 'Pending',
      createdAt: apiSchedule.createdAt,
      updatedAt: apiSchedule.updatedAt
    };
  } catch (error) {
    console.error('Error al convertir formato de reunión:', error);
    return null;
  }
};

/**
 * Convierte una reunión del formato del cliente al formato de la API
 * @param {Object} clientSchedule - Datos de la reunión en formato cliente
 * @returns {Object} Datos de la reunión en formato API
 */
export const clientToApiSchedule = clientSchedule => {
  if (!clientSchedule) return null;

  try {
    // Construir fecha ISO 8601 completa combinando fecha y hora
    let meetingDate;
    if (clientSchedule.date instanceof Date) {
      meetingDate = new Date(clientSchedule.date);
    } else if (typeof clientSchedule.date === 'string') {
      meetingDate = new Date(clientSchedule.date);
    } else {
      meetingDate = new Date();
    }

    // Si recibimos la hora del cliente como string (HH:MM), actualizar la fecha
    const startDate = new Date(meetingDate);
    if (clientSchedule.time && typeof clientSchedule.time === 'string') {
      const [hours, minutes] = clientSchedule.time.split(':');
      startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }

    // Calcular fecha de fin
    const duration = parseInt(clientSchedule.duration || '30', 10);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    // Datos a enviar al servidor
    return {
      id: clientSchedule.id,
      title: clientSchedule.title || '',
      date: startDate.toISOString(),
      startTime: startDate.toISOString(), // Enviar como ISO string completo
      endTime: endDate.toISOString(), // Enviar como ISO string completo
      duration: clientSchedule.duration?.toString() || '30',
      lead: clientSchedule.lead || clientSchedule.leadId || null,
      location: clientSchedule.location || '',
      description: clientSchedule.description || '',
      status: clientSchedule.status || 'Pending'
    };
  } catch (error) {
    console.error('Error al convertir formato de reunión para API:', error);
    return null;
  }
};

/**
 * Calcula la duración en minutos entre dos fechas
 * @param {string} startTime - Hora de inicio en formato ISO
 * @param {string} endTime - Hora de fin en formato ISO
 * @returns {string} Duración en minutos
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '30';

  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  return String(Math.round(diffMs / (1000 * 60)));
};

/**
 * Calcula la hora de fin basada en la hora de inicio y duración
 * @param {string} startTime - Hora de inicio en formato ISO
 * @param {string} duration - Duración en minutos
 * @returns {string} Hora de fin en formato ISO
 */
export const calculateEndTime = (startTime, duration) => {
  if (!startTime) return null;

  const start = new Date(startTime);
  const durationMinutes = parseInt(duration, 10) || 30;
  const end = new Date(start.getTime() + durationMinutes * 60000);
  return end.toISOString();
};
