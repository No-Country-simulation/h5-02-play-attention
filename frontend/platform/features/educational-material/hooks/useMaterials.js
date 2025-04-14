import { useState } from 'react';

// Mock data - would come from an API in production
const MOCK_MATERIALS = [
  {
    id: 1,
    title: 'Introduction to Play Attention',
    description:
      'Learn the basics of the Play Attention program and how it can help improve cognitive abilities.',
    type: 'pdf',
    size: '2.4 MB',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'BrainAware™ Technology Guide',
    description:
      'Detailed explanation of the NASA-inspired technology behind Play Attention.',
    type: 'pdf',
    size: '3.1 MB',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'ADHD and Executive Functions',
    description:
      'Understanding the relationship between ADHD and executive function disorders.',
    type: 'pdf',
    size: '1.8 MB',
    downloadUrl: '#'
  },
  {
    id: 4,
    title: 'Getting Started with Play Attention',
    description:
      'Step-by-step guide to setting up and beginning your Play Attention journey.',
    type: 'pdf',
    size: '4.2 MB',
    downloadUrl: '#'
  }
];

export function useMaterials() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic
  const filteredMaterials = MOCK_MATERIALS.filter(
    material =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    materials: filteredMaterials,
    searchQuery,
    setSearchQuery
  };
}
