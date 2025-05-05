import { useState, useEffect } from 'react';
import { fetchEducationalMaterials } from '../../../../shared/lib/api/content/api';

const getFileSize = async url => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const bytes = parseInt(contentLength);
      const mb = (bytes / (1024 * 1024)).toFixed(1);
      return `${mb} MB`;
    }
    return '---';
  } catch (error) {
    console.error('Error getting file size:', error);
    return '---';
  }
};

export function useEducationalMaterials() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEducationalMaterials();
        const filteredData = data.filter(
          item => item.category?.name === 'Material Eductaivo'
        );

        // Get file sizes for all materials
        const materialsWithSizes = await Promise.all(
          filteredData.map(async item => {
            const fileSize = item.url ? await getFileSize(item.url) : '---';
            const date = new Date(item.createdAt);
            const formattedDate = `${date.getDate()} de ${
              [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic'
              ][date.getMonth()]
            } ${date.getFullYear()}`;

            return {
              id: item._id,
              title: item.title,
              description: item.description,
              type: item.type || 'PDF',
              date: formattedDate,
              rawDate: item.createdAt,
              size: fileSize,
              url: item.url
            };
          })
        );

        setMaterials(materialsWithSizes);
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
    if (action === 'view') {
      if (
        material.type.toLowerCase() !== 'pdf' &&
        material.url &&
        material.url !== '#'
      ) {
        window.open(material.url, '_blank');
      }
    } else {
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
