import { z } from 'zod';

// Esquema de validación con Zod
export const leadFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.'
  }),
  email: z.string().email({
    message: 'Por favor ingresa un email válido.'
  }),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  source: z.string().default('Sitio web'),
  userType: z.string().default('persona'),
  notes: z.string().optional(),
  newsletter: z.boolean().default(false)
});

// Valores por defecto
export const defaultValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  source: 'Sitio web',
  userType: 'persona',
  notes: '',
  newsletter: false
};
