import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { leadFormSchema, defaultValues } from '../validation/leadSchema';
import { useCreateLead } from './useLeads';

export function useLeadForm() {
  const router = useRouter();
  const createLeadMutation = useCreateLead();
  const [showCompanyField, setShowCompanyField] = useState(false);

  // Inicializar formulario con React Hook Form y validación Zod
  const form = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues
  });

  // Observar cambios en el tipo de usuario para mostrar/ocultar campo de empresa
  const userType = form.watch('userType');

  // Actualizar la visibilidad del campo company cuando cambia el tipo de usuario
  useEffect(() => {
    setShowCompanyField(userType === 'empresa');
  }, [userType]);

  // Manejar envío del formulario
  const onSubmit = async data => {
    try {
      await createLeadMutation.mutateAsync(data);
      router.push('/crm');
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const isSubmitting = createLeadMutation.isPending;

  const handleCancel = () => {
    router.push('/crm');
  };

  return {
    form,
    showCompanyField,
    userType,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel
  };
}
