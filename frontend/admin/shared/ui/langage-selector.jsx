'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Select from 'react-select';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const languages = [
  { value: 'en', label: 'Ingles', flag: '/svgs/lang/en.svg' },
  { value: 'es', label: 'Español', flag: '/svgs/lang/es.svg' }
];

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Solo renderizar el componente en el cliente para evitar errores de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLanguageChange = selectedOption => {
    const newLocale = selectedOption.value;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  // Crear un placeholder para el SSR
  if (!isMounted) {
    return (
      <div className='px-2 py-1 text-white text-sm'>
        {locale === 'en' ? 'English' : 'Español'}
      </div>
    );
  }

  return (
    <div>
      <Select
        value={languages.find(lang => lang.value === locale)}
        onChange={handleLanguageChange}
        options={languages}
        menuPlacement='auto'
        menuPosition='fixed'
        getOptionLabel={e => (
          <div className='flex items-center rounded-md'>
            <Image
              width={30}
              height={20}
              src={e.flag}
              alt={e.label}
              className='w-6 h-4 mr-2 rounded-sm'
            />
            {e.label}
          </div>
        )}
        styles={{
          control: base => ({
            ...base,
            backgroundColor: 'transparent',
            border: '2px solid transparent',
            '&:hover': {
              borderColor: '#00ff99'
            },
            '&:focus': {
              borderColor: 'transparent',
              boxShadow: 'none'
            },
            padding: '0',
            boxShadow: 'none',
            fontSize: '12px',
            cursor: 'pointer'
          }),
          menu: base => ({
            ...base,
            backgroundColor: '#1c1c22',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            zIndex: 100
          }),
          option: (base, state) => ({
            ...base,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '10px',
            color: state.isSelected ? '#1c1c22' : '#fff',
            backgroundColor: state.isSelected
              ? '#00ff99'
              : state.isFocused
              ? '#2a2a32'
              : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#00e187',
              color: '#1c1c22'
            }
          }),
          singleValue: base => ({
            ...base,
            color: '#fff'
          })
        }}
      />
    </div>
  );
};

export default LanguageSwitcher;
