/**
 * Utilidad para generar y gestionar slots de tiempo para reuniones
 */

// Configuración de horario comercial
export const BUSINESS_HOURS = {
  start: 9, // 9:00 AM
  end: 18 // 6:00 PM
};

/**
 * Genera slots de tiempo disponibles para un día específico
 * @param {Date} date - Fecha para la que se generarán los slots
 * @param {number} durationMinutes - Duración de cada slot en minutos (default: 30)
 * @param {Array} existingMeetings - Reuniones existentes para verificar disponibilidad
 * @returns {Array} Array de objetos {time: string, available: boolean}
 */
export const generateTimeSlots = (
  date,
  durationMinutes = 30,
  existingMeetings = []
) => {
  // Normalizar fecha eliminando la parte de hora
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  // Verificar si es fin de semana (0 = domingo, 6 = sábado)
  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return []; // No hay slots disponibles los fines de semana
  }

  // Convertir reuniones existentes a pares de hora inicio-fin
  const bookedSlots = existingMeetings
    .filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getFullYear() === selectedDate.getFullYear() &&
        meetingDate.getMonth() === selectedDate.getMonth() &&
        meetingDate.getDate() === selectedDate.getDate()
      );
    })
    .map(meeting => {
      const startTime = new Date(meeting.date);
      const endTime = meeting.endTime
        ? new Date(meeting.endTime)
        : new Date(
            startTime.getTime() + parseInt(meeting.duration || '30', 10) * 60000
          );

      return {
        start: startTime,
        end: endTime
      };
    });

  // Generar todos los slots posibles del día
  const slots = [];
  const incrementMinutes = durationMinutes || 30;

  // Verificar si es hoy para no mostrar slots pasados
  const now = new Date();
  const isToday =
    now.getFullYear() === selectedDate.getFullYear() &&
    now.getMonth() === selectedDate.getMonth() &&
    now.getDate() === selectedDate.getDate();

  let startHour = BUSINESS_HOURS.start;

  // Si es hoy y ya pasó la hora de inicio del horario comercial, ajustar
  if (isToday && now.getHours() >= BUSINESS_HOURS.start) {
    startHour = now.getHours();
    // Redondear al próximo slot disponible
    const minutes = now.getMinutes();
    const remainder = minutes % incrementMinutes;
    if (remainder > 0) {
      // Si ya pasaron algunos minutos del slot, pasar al siguiente
      now.setMinutes(minutes + (incrementMinutes - remainder));
      if (now.getMinutes() < minutes) {
        // Verificar si cambió la hora
        startHour = now.getHours();
      }
    }
  }

  // Generar slots desde la hora de inicio hasta el fin del horario comercial
  for (let hour = startHour; hour < BUSINESS_HOURS.end; hour++) {
    for (let minute = 0; minute < 60; minute += incrementMinutes) {
      // Si es la primera iteración y es hoy, verificar si la hora ya pasó
      if (
        hour === startHour &&
        isToday &&
        minute < now.getMinutes() &&
        hour === now.getHours()
      ) {
        continue;
      }

      // Crear fecha/hora para este slot
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, minute, 0, 0);

      // El slot termina después de la duración especificada
      const slotEndTime = new Date(
        slotTime.getTime() + incrementMinutes * 60000
      );

      // Si el slot terminaría después del horario comercial, omitirlo
      if (
        slotEndTime.getHours() >= BUSINESS_HOURS.end &&
        slotEndTime.getMinutes() > 0
      ) {
        continue;
      }

      // Verificar si el slot está disponible (no se solapa con reuniones existentes)
      let isAvailable = true;
      for (const bookedSlot of bookedSlots) {
        // Verificar solapamiento
        const slotStart = slotTime.getTime();
        const slotEnd = slotEndTime.getTime();
        const bookedStart = bookedSlot.start.getTime();
        const bookedEnd = bookedSlot.end.getTime();

        // Un slot no está disponible si:
        // - El inicio del slot está entre el inicio y fin de una reunión existente
        // - El fin del slot está entre el inicio y fin de una reunión existente
        // - El slot comienza antes y termina después de una reunión existente
        if (
          (slotStart >= bookedStart && slotStart < bookedEnd) ||
          (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
          (slotStart <= bookedStart && slotEnd >= bookedEnd)
        ) {
          isAvailable = false;
          break;
        }
      }

      // Formatear hora para mostrar (HH:MM)
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');

      slots.push({
        time: `${formattedHour}:${formattedMinute}`,
        available: isAvailable,
        startTime: slotTime,
        endTime: slotEndTime
      });
    }
  }

  return slots;
};

/**
 * Obtiene la duración en minutos entre dos horas
 * @param {string} startTime - Hora de inicio en formato HH:MM
 * @param {string} endTime - Hora de fin en formato HH:MM
 * @returns {number} Duración en minutos
 */
export const getDurationBetweenTimes = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return endMinutes - startMinutes;
};

/**
 * Calcula la hora de fin basada en la hora de inicio y duración
 * @param {string} startTime - Hora de inicio en formato HH:MM
 * @param {number} durationMinutes - Duración en minutos
 * @returns {string} Hora de fin en formato HH:MM
 */
export const calculateEndTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);

  let totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHour = Math.floor(totalMinutes / 60);
  const endMinute = totalMinutes % 60;

  return `${endHour.toString().padStart(2, '0')}:${endMinute
    .toString()
    .padStart(2, '0')}`;
};
