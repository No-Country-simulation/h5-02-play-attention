'use client';

import MaterialCard from './MaterialCard';
import NoResults from './NoResults';

export default function MaterialList({ materials }) {
  if (materials.length === 0) {
    return <NoResults />;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {materials.map(material => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  );
}
