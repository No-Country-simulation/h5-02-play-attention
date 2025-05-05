'use client';

import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MaterialsTable } from './components/MaterialsTable';
import { useEducationalMaterials } from './lib/hooks/useEducationalMaterials';

/**
 * Main Educational Material component
 * Responsible for displaying and managing educational materials
 */
export default function EducationalMaterial() {
  const { materials, isLoading, error, handleDownload } =
    useEducationalMaterials();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredMaterials(materials);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = materials.filter(
      material =>
        material.title.toLowerCase().includes(query) ||
        (material.description &&
          material.description.toLowerCase().includes(query))
    );
    setFilteredMaterials(filtered);
  };

  // Initialize filtered materials with all materials
  React.useEffect(() => {
    setFilteredMaterials(materials);
  }, [materials]);

  // Update search results when search query changes
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMaterials(materials);
    }
  }, [searchQuery, materials]);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Material Educativo</h1>
        <p className='text-gray-600 mt-1'>
          Explora y accede a recursos educativos para mejorar tus habilidades
        </p>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      ) : error ? (
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
          role='alert'
        >
          <strong className='font-bold'>Error:</strong>
          <span className='block sm:inline'> {error}</span>
        </div>
      ) : (
        <MaterialsTable
          materials={filteredMaterials}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
