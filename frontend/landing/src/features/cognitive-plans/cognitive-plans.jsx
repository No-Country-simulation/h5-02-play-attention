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
    <div className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4'>
            Planes de entrenamiento cognitivo
          </h2>
          <p className='text-gray-600 max-w-3xl mx-auto'>
            Soluciones de entrenamiento cognitivo diseñadas para mejorar la
            concentración, la memoria y la función ejecutiva, con opciones para
            uso doméstico y profesional.
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
            />
          </div>
        </div>

        <div className='text-center text-xs text-gray-500 mt-8 max-w-4xl mx-auto'>
          <p>
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
