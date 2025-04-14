'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Select from 'react-select';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '/svgs/lang/en.svg' },
  { value: 'es', label: 'Español', flag: '/svgs/lang/es.svg' }
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const settingsT = useTranslations('settings');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Creamos un array de idiomas con etiquetas traducidas
  const languages = LANGUAGES.map(lang => ({
    ...lang,
    translatedLabel: t(`languageNames.${lang.value}`)
  }));

  const handleLanguageChange = option => {
    const pathSegments = pathname.split('/');
    pathSegments[1] = option.value; // Replace the locale segment
    router.push(pathSegments.join('/'));
  };

  // No renderizar en el servidor para evitar diferencias de hidratación
  if (!isMounted) return null;

  return (
    <div className='inline-block align-middle'>
      <p className='sr-only'>{settingsT('selectLanguage')}</p>
      <Select
        defaultValue={languages.find(lang => lang.value === locale)}
        onChange={handleLanguageChange}
        options={languages}
        unstyled
        menuPlacement='auto'
        menuPosition='fixed'
        formatOptionLabel={option => (
          <div className='flex items-center'>
            <Image
              src={option.flag}
              alt={option.translatedLabel}
              width={20}
              height={15}
              className='mr-2'
            />
            <span>{option.translatedLabel}</span>
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
}
