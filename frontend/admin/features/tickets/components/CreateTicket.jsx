'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function CreateTicket() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'media',
    category: 'tecnico'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aquí iría la lógica para enviar el formulario a la API
      console.log('Enviando ticket:', formData);

      // Simulamos un tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirigimos al listado de tickets
      router.push('/tickets');
    } catch (error) {
      console.error('Error al crear el ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto py-6'>
      <Button
        variant='ghost'
        className='mb-4 gap-2'
        onClick={() => router.push('/tickets')}
      >
        <ArrowLeft className='h-4 w-4' /> Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Ticket</CardTitle>
          <CardDescription>
            Complete el formulario para crear un nuevo ticket de soporte
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='subject'>Asunto</Label>
              <Input
                id='subject'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                placeholder='Ingrese un asunto descriptivo'
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='priority'>Prioridad</Label>
                <Select
                  name='priority'
                  value={formData.priority}
                  onValueChange={value => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione prioridad' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='baja'>Baja</SelectItem>
                    <SelectItem value='media'>Media</SelectItem>
                    <SelectItem value='alta'>Alta</SelectItem>
                    <SelectItem value='urgente'>Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Categoría</Label>
                <Select
                  name='category'
                  value={formData.category}
                  onValueChange={value => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione categoría' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='tecnico'>Problema técnico</SelectItem>
                    <SelectItem value='facturacion'>Facturación</SelectItem>
                    <SelectItem value='cuenta'>Cuenta</SelectItem>
                    <SelectItem value='otro'>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='message'>Mensaje</Label>
              <Textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Describa su consulta o problema en detalle'
                rows={5}
                required
              />
            </div>
          </CardContent>

          <CardFooter className='flex justify-end'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Crear Ticket'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
