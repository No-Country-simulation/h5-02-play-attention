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

    return {
      id: id,
      title: apiSchedule.title || '',
      date:
        apiSchedule.date || apiSchedule.startTime || new Date().toISOString(),
      endTime: apiSchedule.endTime || null,
      duration: apiSchedule.duration?.toString() || '30',
      leadId: apiSchedule.leadId || apiSchedule.lead || '',
      leadName: apiSchedule.leadName || apiSchedule.client || '',
      location: apiSchedule.location || apiSchedule.place || '',
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
    // Construir el objeto para la API
    return {
      id: clientSchedule.id,
      title: clientSchedule.title,
      date: clientSchedule.date,
      endTime: clientSchedule.endTime,
      duration: parseInt(clientSchedule.duration, 10),
      leadId: clientSchedule.leadId,
      location: clientSchedule.location,
      description: clientSchedule.description,
      status: clientSchedule.status || 'Pending'
    };
  } catch (error) {
    console.error('Error al convertir formato para API:', error);
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
