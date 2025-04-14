// En un entorno real, esta función haría llamadas a una API
export async function fetchMaterials() {
  // Simulamos una llamada API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
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
      ]);
    }, 300);
  });
}

export async function downloadMaterial(id) {
  // Implementación real: comunicación con backend para descarga
  console.log(`Downloading material with id: ${id}`);
  return true;
}
