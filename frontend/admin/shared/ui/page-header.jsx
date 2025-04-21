'use client';

/**
 * Componente reutilizable para el encabezado de páginas
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse únicamente
 * de mostrar el título y subtítulo de una página
 */
export default function PageHeader({
  title,
  description,
  className = '',
  children
}) {
  return (
    <header className={`mb-8 pb-4 border-b ${className}`}>
      <div className='flex justify-between items-center'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <h1 className='text-3xl font-bold'>{title}</h1>
          </div>
          {description && <p className='text-gray-500'>{description}</p>}
        </div>
        {children && <div className='flex-shrink-0'>{children}</div>}
      </div>
    </header>
  );
}
