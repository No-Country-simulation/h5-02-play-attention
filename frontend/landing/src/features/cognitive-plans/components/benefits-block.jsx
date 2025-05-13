import { Check } from 'lucide-react';

// Benefits section component - Open/Closed Principle
export const BenefitsBlock = ({ benefits }) => {
  return (
    <div className='mt-6'>
      <h4 className='font-bold mb-4'>Beneficios</h4>
      <div className='space-y-3'>
        {benefits.map((benefit, index) => (
          <div key={index} className='flex items-start'>
            <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
            <span className='text-sm'>{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};