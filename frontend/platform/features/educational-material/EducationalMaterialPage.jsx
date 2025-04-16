'use client';

import { useMaterials } from './hooks/useMaterials';
import SearchBar from './components/SearchBar';
import MaterialList from './components/MaterialList';

export default function EducationalMaterialPage() {
  const { materials, searchQuery, setSearchQuery } = useMaterials();

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Material Educativo</h1>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <p className='text-gray-600 mb-8'>
        Accede a documentos, presentaciones y guías que te ayudarán a entender y
        aprovechar al máximo Play Attention.
      </p>

      <MaterialList materials={materials} />
    </div>
  );
}
