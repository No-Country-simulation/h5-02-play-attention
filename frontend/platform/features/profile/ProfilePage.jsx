'use client';

import { useState, useEffect } from 'react';
import ProfileCard from './components/ProfileCard';
import PasswordCard from './components/PasswordCard';
import { getUserById, updateUserById } from './lib/api/users';
import { getUserInfoFromCookie } from '@/features/support/lib/utils/cookies';
import { toast } from 'sonner';

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  phone: '',
  profession: '',
  organization: ''
};

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  console.log(userData);
  // Obtener los datos del usuario desde la API usando el ID de la cookie
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Obtener información básica del usuario desde la cookie
        const userInfo = getUserInfoFromCookie();

        if (!userInfo || !userInfo.id) {
          throw new Error('No se pudo obtener el ID del usuario');
        }

        // Obtener información completa del usuario desde la API
        const userDetails = await getUserById(userInfo.id);
        setUserData(userDetails);

        console.log('Datos recibidos del API:', userDetails);

        // Configurar los valores iniciales del formulario con los datos obtenidos
        setInitialValues({
          name: userDetails.name || userDetails.fullname || '',
          email: userDetails.email || '',
          phone: '', // No viene del API
          profession: userDetails.service || userDetails.profession || '', // Usar service o profession
          organization: '' // No viene del API
        });
      } catch (err) {
        console.error('Error al obtener datos de usuario:', err);
        setError(err.message || 'Error al cargar información del perfil');
        setInitialValues(DEFAULT_PROFILE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Función para actualizar el perfil del usuario
  const handleUpdateProfile = async formData => {
    if (!userData || !userData._id) {
      toast.error('No se pudo identificar el usuario para actualizar');
      return;
    }

    setIsUpdating(true);
    try {
      // Actualizar el perfil usando la API
      const updatedUser = await updateUserById(userData._id, formData);

      // Actualizar el estado
      setUserData(updatedUser);
      setInitialValues({
        name: updatedUser.name || updatedUser.fullname || '',
        email: updatedUser.email || '',
        phone: formData.phone || '',
        profession: updatedUser.service || updatedUser.profession || '',
        organization: formData.organization || ''
      });

      toast.success('Tus datos han sido actualizados correctamente');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      toast.error(
        err.message || 'No se pudo actualizar tu perfil. Intenta nuevamente.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-1'>Mi Perfil</h1>
      <p className='text-gray-500 mb-6'>
        Administra tu información personal y preferencias de notificaciones
      </p>

      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded'>
          {error}
        </div>
      )}

      <ProfileCard
        initialValues={initialValues}
        isLoading={isLoading}
        isUpdating={isUpdating}
        userData={userData}
        onUpdateProfile={handleUpdateProfile}
      />
      <PasswordCard />
    </div>
  );
}
