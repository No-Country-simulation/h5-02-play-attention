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
    const leadId = apiSchedule.leadId || apiSchedule.lead || '';

    // El backend puede enviar la ubicación como location o place
    const location = apiSchedule.location || apiSchedule.place || '';

    return {
      id: id,
      title: apiSchedule.title || '',
      date: meetingDate,
      endTime: apiSchedule.endTime || null,
      duration: apiSchedule.duration?.toString() || '30',
      leadId: leadId,
      leadName: apiSchedule.leadName || apiSchedule.client || '',
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
      meetingDate = clientSchedule.date;
    } else if (typeof clientSchedule.date === 'string') {
      meetingDate = new Date(clientSchedule.date);
    } else {
      meetingDate = new Date();
    }

    // Si recibimos la hora del cliente como string (HH:MM), actualizar la fecha
    if (clientSchedule.time && typeof clientSchedule.time === 'string') {
      const [hours, minutes] = clientSchedule.time.split(':');
      meetingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }

    // Datos a enviar al servidor
    return {
      id: clientSchedule.id,
      title: clientSchedule.title || '',
      date: meetingDate.toISOString(),
      duration: clientSchedule.duration?.toString() || '30',
      leadId: clientSchedule.leadId || null,
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
