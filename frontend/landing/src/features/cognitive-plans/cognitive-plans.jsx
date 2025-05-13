'use client';
import { Check } from 'lucide-react';
import { PlanCard } from './components';

// Main component that uses the smaller components
export function CognitivePlansSection() {
  // Common benefits - DRY principle
  const commonBenefits = [
    'Financiación al 0% disponible con Shop Pay',
    'Un brazalete BodyWave®',
    'Entrenador de enfoque dedicado',
    'Seis ejercicios cognitivos incluidos'
  ];

  const hogarBenefits = ['Licencia para hasta 2 usuarios'];

  const profesionalBenefits = [
    'Licencias de usuario ilimitadas',
    'Entrenamiento cognitivo de nivel profesional',
    'Soporte profesional dedicado',
    'Ideal para clínicas o educadores',
    'Seis ejercicios cognitivos incluidos'
  ];

  // Construimos beneficios para mostrar en cada sección de la tarjeta
  const hogarCardBenefits = [
    'Financiación al 0% disponible con Shop Pay',
    'Licencia para hasta 2 usuarios',
    'Un brazalete BodyWave®',
    'Entrenador de enfoque dedicado',
    'Seis ejercicios cognitivos incluidos'
  ];

  const profesionalCardBenefits = [
    'Financiación al 0% disponible con Shop Pay',
    'Un brazalete BodyWave®',
    'Entrenador de enfoque dedicado',
    'Seis ejercicios cognitivos incluidos'
  ];

  return (
    <div className='py-24 relative overflow-hidden'>
      {/* Elementos decorativos de fondo */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-64 h-64 rounded-full bg-[#E9EBF8]/30 blur-3xl' />
        <div className='absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#240547]/10 blur-3xl' />
      </div>

      <div className='container mx-auto px-4 md:px-6 relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>
            Planes de entrenamiento cognitivo
          </h2>
          <p className='text-gray-600 max-w-3xl mx-auto text-lg'>
            Soluciones diseñadas para mejorar la concentración, memoria y
            función ejecutiva, con opciones personalizadas para diferentes
            necesidades.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
          {/* Hogar Plan */}
          <div className='h-full'>
            <PlanCard
              title='Hogar'
              subtitle='Perfecto para uso doméstico'
              benefits={hogarCardBenefits}
              buttonText='Adquirir Plan'
              buttonAction={() => console.log('Adquirir Plan Hogar')}
              additionalBenefits={hogarCardBenefits}
              isPrimary={false}
            />
          </div>

          {/* Profesional Plan */}
          <div className='h-full'>
            <PlanCard
              title='Profesional'
              subtitle='Ideal para profesionales y clínicas'
              benefits={profesionalCardBenefits}
              buttonText='Consultar Plan'
              buttonAction={() => console.log('Consultar Plan Profesional')}
              additionalBenefits={profesionalBenefits}
              isPrimary={true}
            />
          </div>
        </div>

        <div className='text-center mt-16'>
          <div className='flex justify-center space-x-6 mb-8'>
            <div className='flex items-center'>
              <div className='bg-[#240547] rounded-full p-2 mr-3'>
                <Check className='h-4 w-4 text-white' />
              </div>
              <span>Garantía de devolución</span>
            </div>
            <div className='flex items-center'>
              <div className='bg-[#240547] rounded-full p-2 mr-3'>
                <Check className='h-4 w-4 text-white' />
              </div>
              <span>Soporte 24/7</span>
            </div>
            <div className='flex items-center'>
              <div className='bg-[#240547] rounded-full p-2 mr-3'>
                <Check className='h-4 w-4 text-white' />
              </div>
              <span>Envío gratuito</span>
            </div>
          </div>

          <p className='text-xs text-gray-500 max-w-3xl mx-auto'>
            Al comprar, acepta los términos, incluyendo una comisión de
            reposición del 15% y los beneficios de la membresía de por vida.
            Revise los requisitos del sistema, el proceso de incorporación y la
            política de devoluciones de 30 días.
          </p>
        </div>
      </div>
    </div>
  );
}
