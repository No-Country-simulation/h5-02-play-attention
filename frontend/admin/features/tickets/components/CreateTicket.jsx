'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { toast } from 'sonner';
import { createTicket } from '../lib/api/tickets/createTicket';
import { useAssignableUsers } from '../lib/hooks/useAssignableUsers';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

// Componente con Debug info
function UsersDebug({ users }) {
  if (!users) return null;

  return (
    <div className='bg-yellow-100 p-2 mb-2 rounded text-xs'>
      <div>Usuarios disponibles: {users.length}</div>
      <ul className='pl-4'>
        {users.map(u => (
          <li key={u._id}>
            ID: {u._id} - {u.fullname} - Rol: {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CreateTicket() {
  const router = useRouter();

  // Usar el hook para obtener usuarios asignables
  const {
    data: usersData = [],
    isLoading: isLoadingUsers,
    error: usersError
  } = useAssignableUsers();

  // Crear una versión memoizada para evitar re-renderizados innecesarios
  const users = useMemo(() => {
    console.log('PROCESANDO USUARIOS:', usersData);
    // Si no hay datos, devolver array vacío
    if (!usersData || !Array.isArray(usersData)) {
      console.warn('No hay datos de usuarios válidos');
      return [];
    }
    return usersData;
  }, [usersData]);

  const [showDebug, setShowDebug] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Efecto para depurar
  useEffect(() => {
    console.log('DATOS DE USUARIOS DISPONIBLES:', users);
  }, [users]);

  useEffect(() => {
    // Extraer token directamente - con mejor manejo de errores
    try {
      const tokenCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='));

      if (tokenCookie) {
        // Verificar el formato exacto
        const token = tokenCookie.split('=')[1];

        // En caso de que esté codificado
        try {
          const decodedToken = decodeURIComponent(token);

          setAuthToken(decodedToken);
        } catch (decodeError) {
          console.log(
            'El token no necesita decodificación, usando valor original'
          );
          setAuthToken(token);
        }
      } else {
        console.warn('No se encontró la cookie auth_token');
      }

      // Si tenés una cookie separada con la info del usuario
      const userInfoCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_info='));

      if (userInfoCookie) {
        try {
          const userInfoData = JSON.parse(
            decodeURIComponent(userInfoCookie.split('=')[1])
          );
          setUserInfo(userInfoData);
        } catch (error) {
          console.error('Error al parsear user_info:', error);
        }
      }
    } catch (error) {
      console.error('Error al procesar cookies:', error);
      console.error('Error al procesar cookies:', error);
    }
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'bug',
    priority: 'medium',
    assigned_to: '',
    ticket_origin: 'crm'
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
      // Agregamos el user_id del usuario logueado
      const ticketData = {
        ...formData,
        user_id: userInfo?.id
      };

      // Ya no necesitamos pasar el token como parámetro
      const response = await createTicket(ticketData);
      console.log('Ticket creado:', response);

      // Redirigimos al listado de tickets
      router.push('/tickets');

      // Mostrar mensaje de éxito
      toast.success('Ticket creado exitosamente');
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      toast.error(error.message || 'Error al crear el ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente renderizado condicional para el selector de usuarios
  const renderUserSelect = () => {
    // Si está cargando, mostrar spinner
    if (isLoadingUsers) {
      return (
        <div className='flex items-center justify-center py-2'>
          <LoadingSpinner className='h-6 w-6' />
        </div>
      );
    }

    // Si hay error, mostrar mensaje
    if (usersError) {
      return (
        <div className='text-sm text-red-500'>
          Error al cargar usuarios: {usersError.message}
        </div>
      );
    }

    // Verificar si hay usuarios
    const hasUsers = Array.isArray(users) && users.length > 0;

    return (
      <div>
        {!hasUsers && (
          <div className='text-amber-600 text-xs mb-2'>
            No hay usuarios asignables disponibles.
          </div>
        )}

        <Select
          name='assigned_to'
          value={formData.assigned_to}
          onValueChange={value => handleSelectChange('assigned_to', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Seleccione agente' />
          </SelectTrigger>
          <SelectContent>
            {hasUsers ? (
              users.map(user => (
                <SelectItem key={user._id} value={user._id}>
                  {user.fullname || user.name || user.email}
                </SelectItem>
              ))
            ) : (
              <SelectItem value='no-users' disabled>
                No hay usuarios disponibles
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
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

      {/* Botón para mostrar/ocultar información de debug */}
      <Button
        variant='outline'
        size='sm'
        className='absolute top-4 right-4'
        onClick={() => setShowDebug(!showDebug)}
      >
        {showDebug ? 'Ocultar Debug' : 'Mostrar Debug'}
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
              <Label htmlFor='title'>Título</Label>
              <Input
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder='Ingrese un título descriptivo'
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
                    <SelectItem value='low'>Baja</SelectItem>
                    <SelectItem value='medium'>Media</SelectItem>
                    <SelectItem value='high'>Alta</SelectItem>
                    <SelectItem value='critical'>Crítica</SelectItem>
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
                    <SelectItem value='bug'>Error técnico</SelectItem>
                    <SelectItem value='feature_request'>
                      Nueva funcionalidad
                    </SelectItem>
                    <SelectItem value='billing'>Facturación</SelectItem>
                    <SelectItem value='technical'>Soporte técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='assigned_to'>Asignar a</Label>
              {showDebug && <UsersDebug users={users} />}
              {renderUserSelect()}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='ticket_origin'>Origen del Ticket</Label>
              <Select
                name='ticket_origin'
                value={formData.ticket_origin}
                onValueChange={value =>
                  handleSelectChange('ticket_origin', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seleccione origen' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='crm'>CRM</SelectItem>
                  <SelectItem value='user_platform'>
                    Plataforma de Usuario
                  </SelectItem>
                  <SelectItem value='external'>Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Descripción</Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Describa el problema o solicitud en detalle'
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
