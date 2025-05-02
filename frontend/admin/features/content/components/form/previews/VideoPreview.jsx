/**
 * Componente para previsualizar Video
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo de la previsualización
 */
export function VideoPreview({ url, youtubeId, title }) {
  if (!url && !youtubeId) return null;

  return (
    <div className='mt-2 border rounded-md overflow-hidden max-w-full mx-auto'>
      {youtubeId ? (
        <div className='relative pb-[56.25%] h-0'>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            className='absolute top-0 left-0 w-full h-full'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      ) : (
        url && (
          <div className='relative pb-[56.25%] h-0'>
            <video
              src={url}
              controls
              className='absolute top-0 left-0 w-full h-full'
              title={title}
            >
              Tu navegador no soporta la reproducción de videos.
            </video>
          </div>
        )
      )}
    </div>
  );
}
