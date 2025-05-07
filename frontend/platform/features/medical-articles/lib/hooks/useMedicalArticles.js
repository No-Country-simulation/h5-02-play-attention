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

export function useMedicalArticles() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEducationalMaterials();
        console.log(data);
        const filteredData = data.filter(
          item => item.category?.name === 'Artículos Médicos'
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

  const handleDownload = async (material, action = 'view') => {
    if (!material.url || material.url === '#') {
      console.warn(`URL no disponible para: ${material.title}`);
      alert('Este material no tiene una URL de descarga válida');
      return;
    }

    try {
      if (action === 'view') {
        // Para PDFs nunca deberíamos llegar aquí, pero por si acaso redirigimos a descarga
        if (material.type.toLowerCase() === 'pdf') {
          // Recursivamente llamamos a la misma función con action='download'
          handleDownload(material, 'download');
          return;
        }

        // Para otros tipos de archivos, los abrimos en una nueva pestaña
        if (material.url) {
          window.open(material.url, '_blank');
        }
      } else {
        // Descargar el archivo
        // Para PDFs, forzamos la descarga con extensión .pdf
        if (material.type.toLowerCase() === 'pdf') {
          // Preparar nombre de archivo con la extensión correcta
          let fileName = material.title || 'Artículos_Médicos';
          if (!fileName.toLowerCase().endsWith('.pdf')) {
            fileName += '.pdf';
          }

          // Crear un blob desde la URL (esto garantiza que podamos controlar el nombre del archivo)
          try {
            const response = await fetch(material.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Limpieza
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(blobUrl);
            }, 100);
          } catch (fetchError) {
            console.error('Error al obtener el PDF:', fetchError);
            // Fallback: intentar descarga directa
            const link = document.createElement('a');
            link.href = material.url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
              document.body.removeChild(link);
            }, 100);
          }
        } else {
          // Para otros tipos de archivo, usamos el método estándar
          const link = document.createElement('a');
          link.href = material.url;

          // Preparar nombre de archivo con la extensión correcta
          let fileName = material.title || 'Artículos_Médicos';

          // Para otros tipos de archivo, podemos agregar la extensión correspondiente si no la tiene
          if (
            material.type.toLowerCase() === 'doc' &&
            !fileName.toLowerCase().endsWith('.doc') &&
            !fileName.toLowerCase().endsWith('.docx')
          ) {
            fileName += '.docx';
          } else if (
            material.type.toLowerCase() === 'ppt' &&
            !fileName.toLowerCase().endsWith('.ppt') &&
            !fileName.toLowerCase().endsWith('.pptx')
          ) {
            fileName += '.pptx';
          }

          link.download = fileName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();

          // Limpieza
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error al intentar abrir/descargar el material:', error);
      alert('Hubo un problema al intentar acceder al material');
    }
  };

  return {
    materials,
    isLoading,
    error,
    handleDownload
  };
}
