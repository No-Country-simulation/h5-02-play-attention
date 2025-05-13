'use client';

import { Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';

// Plan Card component - Single Responsibility Principle
export const PlanCard = ({
  title,
  subtitle,
  benefits,
  buttonText,
  buttonAction,
  additionalBenefits
}) => {
  return (
    <div className='flex flex-col h-full bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
      <div className='mb-6'>
        <h3 className='text-2xl font-bold mb-1'>{title}</h3>
        <p className='text-sm text-gray-600'>{subtitle}</p>
      </div>

      <div className='space-y-3 mb-6 flex-grow'>
        {benefits.map((benefit, index) => (
          <div key={index} className='flex items-start'>
            <Check className='h-5 w-5 text-[#838394] mr-2 flex-shrink-0' />
            <span className='text-sm'>{benefit}</span>
          </div>
        ))}
      </div>

      <div className='flex-grow'></div>

      {additionalBenefits && additionalBenefits.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-bold mb-4'>Beneficios</h4>
          <div className='space-y-3'>
            {additionalBenefits.map((benefit, index) => (
              <div key={index} className='flex items-start'>
                <Check className='h-5 w-5 text-[#838394] mr-2 flex-shrink-0' />
                <span className='text-sm'>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={buttonAction}
        className='w-full bg-[#240547] hover:bg-[#240547]/90 text-white'
      >
        {buttonText}
      </Button>
    </div>
  );
};
