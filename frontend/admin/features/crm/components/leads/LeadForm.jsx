'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { toast } from '@/shared/ui/toast';
import {
  leadStatusConfig,
  leadUserTypeConfig,
  leadStatusOptions,
  leadUserTypeOptions,
  leadSourceOptions
} from '../../lib/config/ui-config';

// Esquema de validación con Zod
const leadFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.'
  }),
  email: z.string().email({
    message: 'Por favor ingresa un email válido.'
  }),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  source: z.string({
    required_error: 'Por favor selecciona una fuente.'
  }),
  status: z.string({
    required_error: 'Por favor selecciona un estado.'
  }),
  userType: z.string({
    required_error: 'Por favor selecciona un tipo de usuario.'
  }),
  notes: z.string().optional(),
  service: z.object({
    professional: z.boolean().default(false),
    chatbot: z.boolean().default(false),
    estudiante: z.boolean().default(false),
    calendario: z.boolean().default(false)
  })
});

// Valores por defecto para un lead nuevo
const defaultValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  source: 'Formulario Landing',
  status: 'nuevo',
  userType: 'persona',
  notes: '',
  service: {
    professional: false,
    chatbot: false,
    estudiante: false,
    calendario: false
  }
};

export default function LeadForm({ lead, onSubmit, isSubmitting = false }) {
  // Inicializar formulario con React Hook Form y validación Zod
  const form = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues: lead || defaultValues
  });

  // Lista de fuentes de leads
  const leadSources = leadSourceOptions;

  // Manejar envío de formulario
  const handleSubmit = async data => {
    try {
      await onSubmit(data);
      toast({
        title: lead ? 'Lead actualizado' : 'Lead creado',
        description: lead
          ? `Se ha actualizado correctamente el lead: ${data.name}`
          : `Se ha creado correctamente el lead: ${data.name}`
      });
    } catch (error) {
      console.error('Error al guardar el lead:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Ha ocurrido un error al guardar el lead. Inténtalo de nuevo.'
      });
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{lead ? 'Editar Lead' : 'Nuevo Lead'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nombre completo o institución'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='ejemplo@dominio.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono*</FormLabel>
                    <FormControl>
                      <Input placeholder='+34 600 000 000' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='source'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un origen' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leadSources.map(source => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un estado' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leadStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {leadStatusConfig[status]?.label || status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='userType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de usuario*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un tipo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leadUserTypeOptions.map(type => (
                          <SelectItem key={type} value={type}>
                            {leadUserTypeConfig[type]?.label || type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Información adicional sobre el lead...'
                      className='resize-none'
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Incluye detalles relevantes como intereses, necesidades o
                    información del primer contacto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className='flex justify-between px-0'>
              <Button
                variant='outline'
                type='button'
                onClick={() => window.history.back()}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Guardando...'
                  : lead
                  ? 'Actualizar Lead'
                  : 'Crear Lead'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
