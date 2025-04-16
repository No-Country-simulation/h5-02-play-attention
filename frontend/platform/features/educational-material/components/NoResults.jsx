'use client';

export default function NoResults() {
  return (
    <div className='col-span-full text-center py-12 bg-gray-50 rounded-lg'>
      <p className='text-gray-500'>
        No se encontraron materiales que coincidan con tu criterio de búsqueda.
      </p>
    </div>
  );
}
