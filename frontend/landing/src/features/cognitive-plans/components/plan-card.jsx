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
  additionalBenefits,
  isPrimary = false
}) => {
  return (
    <div className='flex flex-col h-full bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]'>
      <div className='mb-6'>
        <h3 className='text-2xl font-bold mb-1'>{title}</h3>
        <p className='text-sm text-gray-600 mb-3'>{subtitle}</p>
      </div>

      <div className='space-y-3 mb-6'>
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`flex items-start ${index === 0 ? 'mb-4' : ''}`}
          >
            <div className='rounded-full p-1 mr-2 mt-0.5'>
              <Check className='h-4 w-4 text-[#838394]' />
            </div>
            <span className={`text-sm ${index === 0 ? 'font-medium' : ''}`}>
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <div className='flex-grow'></div>

      {additionalBenefits && additionalBenefits.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-bold mb-4 text-[#240547]'>Beneficios</h4>
          <div className='space-y-3'>
            {additionalBenefits.map((benefit, index) => (
              <div key={index} className='flex items-start group'>
                <div className='rounded-full p-1 mr-2 mt-0.5 group-hover:bg-[#240547]/10 transition-all duration-300'>
                  <Check className='h-4 w-4 text-[#838394] group-hover:text-[#240547] transition-colors duration-300' />
                </div>
                <span className='text-sm'>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={buttonAction}
        className={`w-full ${
          isPrimary
            ? 'bg-[#240547] hover:bg-[#240547]/90 text-white'
            : 'bg-white border border-[#240547] text-[#240547] hover:bg-[#240547]/5'
        } rounded-lg py-3 text-base font-medium transition-all duration-300`}
      >
        {buttonText}
      </Button>
    </div>
  );
};
