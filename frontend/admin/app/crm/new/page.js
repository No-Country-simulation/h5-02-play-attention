'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function NewLeadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: '',
    status: 'nuevo',
    priority: 'media',
    notes: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el lead en la API
    console.log('Nuevo lead:', formData);

    // Simulamos la respuesta exitosa y redirigimos
    router.push('/admin/leads');
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Button
        onClick={() => router.push('/admin/leads')}
        variant='ghost'
        className='mb-6'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Volver a leads
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Crear nuevo lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nombre completo</Label>
                <Input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>Teléfono</Label>
                <Input
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='company'>Empresa</Label>
                <Input
                  id='company'
                  name='company'
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='position'>Cargo</Label>
                <Input
                  id='position'
                  name='position'
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='source'>Origen</Label>
                <Select
                  value={formData.source}
                  onValueChange={value => handleSelectChange('source', value)}
                >
                  <SelectTrigger id='source'>
                    <SelectValue placeholder='Seleccionar origen' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='web'>Sitio web</SelectItem>
                    <SelectItem value='referencia'>Referencia</SelectItem>
                    <SelectItem value='evento'>Evento</SelectItem>
                    <SelectItem value='linkedin'>LinkedIn</SelectItem>
                    <SelectItem value='otro'>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='priority'>Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={value => handleSelectChange('priority', value)}
                >
                  <SelectTrigger id='priority'>
                    <SelectValue placeholder='Seleccionar prioridad' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='baja'>Baja</SelectItem>
                    <SelectItem value='media'>Media</SelectItem>
                    <SelectItem value='alta'>Alta</SelectItem>
                    <SelectItem value='urgente'>Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Notas</Label>
              <Textarea
                id='notes'
                name='notes'
                value={formData.notes}
                onChange={handleChange}
                placeholder='Información adicional sobre el lead...'
                className='min-h-[100px]'
              />
            </div>

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/admin/leads')}
              >
                Cancelar
              </Button>
              <Button type='submit'>Guardar lead</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
