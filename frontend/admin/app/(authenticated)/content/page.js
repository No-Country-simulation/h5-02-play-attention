import ContentManager from '@/features/content/ContentManager';

/**
 * Página de Gestión de Contenido
 * Siguiendo el principio de Responsabilidad Única (SRP), esta página solo se encarga
 * de renderizar el componente principal de gestión de contenido
 */
export default function ContentPage() {
  return <ContentManager />;
}
