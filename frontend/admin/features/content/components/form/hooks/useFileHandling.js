import { useState, useEffect, useRef } from 'react';

/**
 * Hook para manejar la lógica de archivos y drag-and-drop
 * Sigue el principio de Responsabilidad Única (SRP) gestionando solo la lógica de archivos
 */
export const useFileHandling = (formData, setFormData) => {
  // Estado para controlar drag and drop
  const [isDragging, setIsDragging] = useState(false);

  // Referencias para los objetos URL creados
  const objectURLs = useRef([]);

  // Limpiar los objectURLs cuando el componente se desmonte
  useEffect(() => {
    return () => {
      // Limpiar cualquier URL creada
      objectURLs.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Función para crear y registrar una nueva URL para objetos
  const createObjectURL = file => {
    if (!file) return '';
    const url = URL.createObjectURL(file);
    objectURLs.current.push(url);
    return url;
  };

  // Manejadores para drag and drop
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileValidation(file);
    }
  };

  // Manejar cambios en el archivo para la entrada de archivo estándar
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileValidation(file);
    }
  };

  // Validar archivos según el tipo de contenido
  const handleFileValidation = file => {
    const fileType = file.type.toLowerCase();

    // Validar tipo de archivo según el tipo de contenido seleccionado
    if (formData.type === 'PDF' && !fileType.includes('pdf')) {
      alert('Por favor selecciona un archivo PDF');
      return;
    }

    if (formData.type === 'Video' && !fileType.includes('video/')) {
      alert('Por favor selecciona un archivo de video');
      return;
    }

    if (formData.type === 'Imagen' && !fileType.includes('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }

    if (
      formData.type === 'Presentación' &&
      !(
        fileType.includes('presentation') ||
        file.name.endsWith('.ppt') ||
        file.name.endsWith('.pptx') ||
        file.name.endsWith('.odp')
      )
    ) {
      alert(
        'Por favor selecciona un archivo de presentación (PPT, PPTX o ODP)'
      );
      return;
    }

    setFormData(prev => ({
      ...prev,
      file: file,
      url: createObjectURL(file),
      youtubeId: null
    }));
  };

  // Función para limpiar archivos del formulario
  const clearFiles = () => {
    if (formData.file) {
      document.getElementById('file').value = '';
    }
    setFormData(prev => ({
      ...prev,
      file: null,
      url: null,
      youtubeId: null
    }));
  };

  // Manejador para el botón de cargar archivo
  const handleFileUploadClick = () => {
    // Activar el input de archivo
    document.getElementById('file').click();
  };

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    handleFileUploadClick,
    clearFiles,
    createObjectURL
  };
};
