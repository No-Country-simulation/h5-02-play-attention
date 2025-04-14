'use client';

import ResourceCard from './ResourceCard';

export default function ResourceGrid({ categories }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {categories.map((category, index) => (
        <ResourceCard key={index} category={category} />
      ))}
    </div>
  );
}
