'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { leadSourceOptions } from '../../lib/config/ui-config';
import { useLeadForm } from '../../lib/hooks/useLeadForm';
import { useCreateLead } from '../../lib/hooks/useLeads';

export default function NewLeadForm() {
  const {
    form,
    showCompanyField,
    userType,
    isSubmitting,
    onSubmit,
    handleCancel
  } = useLeadForm();

  const createLeadMutation = useCreateLead();

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Button
        onClick={handleCancel}
        variant='ghost'
        className='mb-6'
        disabled={isSubmitting}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Volver a leads
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Crear nuevo lead</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {userType === 'empresa'
                          ? 'Nombre del contacto'
                          : 'Nombre completo'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nombre completo'
                          {...field}
                          disabled={isSubmitting}
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='email@ejemplo.com'
                          type='email'
                          {...field}
                          disabled={isSubmitting}
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
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='+34 600 000 000'
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='userType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de usuario</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar tipo' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='persona'>Persona</SelectItem>
                          <SelectItem value='profesional'>
                            Profesional
                          </SelectItem>
                          <SelectItem value='empresa'>Empresa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showCompanyField && (
                  <FormField
                    control={form.control}
                    name='company'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la empresa</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Nombre de la empresa'
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name='position'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo / Relación</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            userType === 'empresa'
                              ? 'Ej: Director, Gerente'
                              : userType === 'profesional'
                              ? 'Ej: Psicólogo, Terapeuta'
                              : 'Ej: Madre, Padre, Estudiante'
                          }
                          {...field}
                          disabled={isSubmitting}
                        />
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
                      <FormLabel>Origen</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar origen' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leadSourceOptions.map(source => (
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
                        className='min-h-[100px]'
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='min-w-[100px]'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Guardando...
                    </>
                  ) : (
                    'Guardar lead'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
