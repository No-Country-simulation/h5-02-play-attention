import { useState } from 'react';

/**
 * Hook para manejar la lógica de enlaces y videos de YouTube
 * Sigue el principio de Responsabilidad Única (SRP) gestionando solo la lógica de enlaces
 */
export const useLinkHandling = (formData, setFormData) => {
  // Estados para los modales
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [tempYoutubeUrl, setTempYoutubeUrl] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [youtubeError, setYoutubeError] = useState('');

  // Manejador para el botón de YouTube
  const handleYouTubeClick = () => {
    // Abrir el modal para ingresar URL de YouTube
    setTempYoutubeUrl('');
    setYoutubeError('');
    setYoutubeModalOpen(true);
  };

  // Manejador para el botón de enlace
  const handleLinkClick = () => {
    // Abrir el modal para ingresar el enlace
    setTempLink('');
    setLinkModalOpen(true);
  };

  // Enviar el enlace de YouTube
  const handleYoutubeSubmit = () => {
    // Validación básica de URL de YouTube
    if (!tempYoutubeUrl.trim()) {
      setYoutubeError('Por favor ingresa una URL');
      return;
    }

    if (
      tempYoutubeUrl.includes('youtube.com/watch') ||
      tempYoutubeUrl.includes('youtu.be/')
    ) {
      // Extraer información del video
      const videoId = extractYoutubeVideoId(tempYoutubeUrl);
      if (videoId) {
        setFormData(prev => ({
          ...prev,
          type: 'Video',
          youtubeId: videoId,
          url: tempYoutubeUrl // Guardamos la URL completa
        }));
        setYoutubeModalOpen(false);
      } else {
        setYoutubeError(
          'No se pudo extraer el ID del video. Verifica que la URL sea correcta.'
        );
      }
    } else {
      setYoutubeError(
        'La URL no parece ser de YouTube. Por favor ingresa un enlace válido de YouTube.'
      );
    }
  };

  // Enviar el enlace normal
  const handleLinkSubmit = () => {
    if (tempLink.trim()) {
      // Agregar el enlace al contenido
      setFormData(prev => ({
        ...prev,
        content: `${prev.content}\n\nEnlace: ${tempLink}`
      }));
      setLinkModalOpen(false);
    }
  };

  // Función auxiliar para extraer el ID de video de YouTube de una URL
  const extractYoutubeVideoId = url => {
    try {
      // Para URLs en formato youtube.com/watch?v=VIDEO_ID
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
      }
      // Para URLs en formato youtu.be/VIDEO_ID
      else if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts.length > 1) {
          // Eliminar cualquier parámetro adicional
          return parts[1].split('?')[0].split('&')[0];
        }
      }
    } catch (error) {
      console.error('Error al extraer ID de video:', error);
    }
    return null;
  };

  return {
    youtubeModalOpen,
    setYoutubeModalOpen,
    linkModalOpen,
    setLinkModalOpen,
    tempYoutubeUrl,
    setTempYoutubeUrl,
    tempLink,
    setTempLink,
    youtubeError,
    handleYouTubeClick,
    handleLinkClick,
    handleYoutubeSubmit,
    handleLinkSubmit
  };
};
