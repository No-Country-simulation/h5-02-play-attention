import { useState, useEffect } from 'react';
import { mockEducationalMaterials } from '../mocks/mockData';
/**
 * Custom hook to fetch and manage educational materials data
 */
export function useEducationalMaterials() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Uncomment this and remove the mock data when the API is ready
        // const data = await fetchEducationalMaterials();

        // Using mock data for development
        // This simulates an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = mockEducationalMaterials;

        setMaterials(data);
      } catch (err) {
        setError('Error al cargar los materiales educativos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const handleDownload = (material, action = 'view') => {
    // Implementation for downloading or viewing the material
    console.log(
      `${action === 'view' ? 'Visualizando' : 'Descargando'} material:`,
      material
    );

    if (action === 'view') {
      if (material.url && material.url !== '#') {
        window.open(material.url, '_blank');
      } else {
        alert(`Visualizando: ${material.title}`);
      }
    } else {
      // Download action
      if (material.url && material.url !== '#') {
        const link = document.createElement('a');
        link.href = material.url;
        link.download = material.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(`Descargando: ${material.title}`);
      }
    }
  };

  return {
    materials,
    isLoading,
    error,
    handleDownload
  };
}
