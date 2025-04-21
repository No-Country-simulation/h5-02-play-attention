import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Datos de ejemplo para desarrollo
const SAMPLE_MEETINGS = [
  {
    id: '1',
    title: 'Presentación de proyecto',
    date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    leadId: '1',
    client: 'Juan Pérez',
    location: 'Oficina central',
    description: 'Presentación inicial del proyecto',
    duration: '60'
  },
  {
    id: '2',
    title: 'Seguimiento de propuesta',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    leadId: '2',
    client: 'María González',
    location: 'Videollamada',
    description: 'Revisar avances y resolver dudas',
    duration: '30'
  }
];

/**
 * Store para la gestión de reuniones y citas
 * Implementa persistencia local para mantener los datos entre sesiones
 */
export const useMeetingsStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      meetings: process.env.NODE_ENV === 'development' ? SAMPLE_MEETINGS : [],
      isLoading: false,
      error: null,

      // Acciones

      // Obtener todas las reuniones
      fetchMeetings: async () => {
        set({ isLoading: true, error: null });
        try {
          // En una implementación real, aquí se haría la llamada a la API
          // Por ahora, simulamos un delay y usamos datos de ejemplo
          await new Promise(resolve => setTimeout(resolve, 500));

          // En desarrollo usamos datos de ejemplo, en producción vendría de la API
          if (process.env.NODE_ENV === 'development') {
            set({ meetings: SAMPLE_MEETINGS, isLoading: false });
          } else {
            // Aquí iría la llamada a la API real
            set({ isLoading: false });
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          console.error('Error al cargar reuniones:', error);
        }
      },

      // Agregar una nueva reunión
      addMeeting: async meeting => {
        set({ isLoading: true, error: null });
        try {
          // En una implementación real, aquí se haría la llamada a la API
          await new Promise(resolve => setTimeout(resolve, 300));

          // Asegurarse de que la reunión tenga un ID único
          const newMeeting = {
            ...meeting,
            id: meeting.id || Date.now().toString()
          };

          set(state => ({
            meetings: [...state.meetings, newMeeting],
            isLoading: false
          }));

          return newMeeting;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          console.error('Error al agregar reunión:', error);
          throw error;
        }
      },

      // Actualizar una reunión existente
      updateMeeting: async (id, updatedData) => {
        set({ isLoading: true, error: null });
        try {
          // En una implementación real, aquí se haría la llamada a la API
          await new Promise(resolve => setTimeout(resolve, 300));

          set(state => ({
            meetings: state.meetings.map(meeting =>
              meeting.id === id ? { ...meeting, ...updatedData } : meeting
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
          console.error('Error al actualizar reunión:', error);
          throw error;
        }
      },

      // Eliminar una reunión
      deleteMeeting: async id => {
        set({ isLoading: true, error: null });
        try {
          // En una implementación real, aquí se haría la llamada a la API
          await new Promise(resolve => setTimeout(resolve, 300));

          set(state => ({
            meetings: state.meetings.filter(meeting => meeting.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
          console.error('Error al eliminar reunión:', error);
          throw error;
        }
      }
    }),
    {
      name: 'crm-meetings-storage', // Nombre para el almacenamiento en localStorage
      partialize: state => ({ meetings: state.meetings }) // Solo persistir las reuniones
    }
  )
);
