import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../api/schedule';

/**
 * Hook para obtener todos los horarios
 */
export const useSchedules = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      try {
        const data = await getSchedules();

        // El backend puede devolver { schedules: [...] } o directamente el array
        const schedules = data.schedules || data;

        console.log('Datos recibidos del backend:', data);
        console.log('Reuniones extraídas:', schedules);

        return schedules;
      } catch (error) {
        console.error('Error al obtener horarios:', error);
        throw new Error(error.message || 'Error al cargar horarios');
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchOnWindowFocus: false,
    retry: 1
  });
};

/**
 * Hook para obtener un horario específico por ID
 */
export const useSchedule = id => {
  return useQuery({
    queryKey: ['schedules', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        return await getScheduleById(id);
      } catch (error) {
        console.error(`Error al obtener horario con ID ${id}:`, error);
        throw new Error(error.message || 'Error al cargar el horario');
      }
    },
    enabled: !!id, // Solo ejecutar si hay un ID
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchOnWindowFocus: false
  });
};

/**
 * Hook para crear un nuevo horario
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async scheduleData => {
      try {
        return await createSchedule(scheduleData);
      } catch (error) {
        console.error('Error al crear horario:', error);
        throw new Error(error.message || 'Error al crear el horario');
      }
    },
    onSuccess: () => {
      // Invalidar consultas para recargar datos
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Horario creado correctamente');
    },
    onError: error => {
      toast.error(`Error al crear horario: ${error.message}`);
    }
  });
};

/**
 * Hook para actualizar un horario existente
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        return await updateSchedule(id, data);
      } catch (error) {
        console.error(`Error al actualizar horario con ID ${id}:`, error);
        throw new Error(error.message || 'Error al actualizar el horario');
      }
    },
    onSuccess: (_, variables) => {
      // Invalidar consultas para recargar datos
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['schedules', variables.id] });
      toast.success('Horario actualizado correctamente');
    },
    onError: error => {
      toast.error(`Error al actualizar horario: ${error.message}`);
    }
  });
};

/**
 * Hook para eliminar un horario
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async id => {
      try {
        return await deleteSchedule(id);
      } catch (error) {
        console.error(`Error al eliminar horario con ID ${id}:`, error);
        throw new Error(error.message || 'Error al eliminar el horario');
      }
    },
    onSuccess: () => {
      // Invalidar consultas para recargar datos
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Horario eliminado correctamente');
    },
    onError: error => {
      toast.error(`Error al eliminar horario: ${error.message}`);
    }
  });
};
