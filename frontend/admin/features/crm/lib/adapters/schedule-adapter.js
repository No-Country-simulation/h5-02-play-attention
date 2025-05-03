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
    // Verificar leadId obligatorio
    if (!clientSchedule.leadId) {
      console.error(
        'Error: leadId es obligatorio para crear/actualizar una reunión'
      );
      throw new Error('El ID del lead es obligatorio');
    }

    // Verificar fecha obligatoria
    if (!clientSchedule.date) {
      console.error(
        'Error: date es obligatorio para crear/actualizar una reunión'
      );
      throw new Error('La fecha de inicio es obligatoria');
    }

    // Construir el objeto para la API con los nombres de campos correctos
    return {
      title: clientSchedule.title,
      description: clientSchedule.description || '',
      // Enviar fecha como startTime y date para asegurar compatibilidad
      startTime: clientSchedule.date,
      date: clientSchedule.date,
      endTime: clientSchedule.endTime,
      // Enviar leadId como lead (nombre esperado por el backend)
      lead: clientSchedule.leadId,
      duration: parseInt(clientSchedule.duration, 10),
      status: clientSchedule.status || 'Pending',
      place: clientSchedule.location || '',
      // Si hay un ID existente, incluirlo para actualizaciones
      ...(clientSchedule.id && { id: clientSchedule.id })
    };
  } catch (error) {
    console.error('Error al convertir formato para API:', error);
    throw error; // Propagar el error para que pueda ser manejado por el componente
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
