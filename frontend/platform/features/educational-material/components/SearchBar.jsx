'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  const t = useTranslations('educationalMaterial');

  return (
    <div className='relative'>
      <Search
        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
        size={18}
      />
      <input
        type='text'
        placeholder={t('searchPlaceholder')}
        className='pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
