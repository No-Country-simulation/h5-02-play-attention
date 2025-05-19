import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

/**
 * Componente para mostrar un gráfico en una tarjeta
 * @param {string} title - Título del gráfico
 * @param {string} description - Descripción del gráfico
 * @param {React.RefObject} chartRef - Referencia al canvas del gráfico
 * @param {Array} data - Datos para el gráfico
 * @param {boolean} hasData - Indica si hay datos para mostrar
 * @param {boolean} hasSampleData - Indica si los datos son de muestra
 * @param {string} className - Clases adicionales para el componente
 * @param {string} height - Altura del contenedor del gráfico
 */
export const ChartCard = ({
  title,
  description,
  chartRef,
  data = [],
  hasData = true,
  hasSampleData = false,
  className = '',
  height = '180px'
}) => {
  // Calcula el total general para porcentajes
  const totalGeneral = data.reduce((acc, item) => acc + item.value, 0);

  // Procesar altura para aplicar un estilo consistente
  const processedHeight = height === '100%' ? '100%' : height;

  return (
    <Card
      className={`${className}`}
      style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}
    >
      <CardHeader
        className='p-2 pb-0'
        style={{ flexShrink: 0, height: 'auto' }}
      >
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <CardDescription className='text-xs'>{description}</CardDescription>

        {/* Resumen visual de datos */}
        {hasData && data.length > 0 && (
          <div className='mt-1 mb-1 flex-shrink-0'>
            <div className='flex flex-wrap gap-2 items-center'>
              {data.map((item, index) => {
                const percentage =
                  totalGeneral > 0
                    ? Math.round((item.value / totalGeneral) * 100)
                    : 0;

                const getColorClass = index => {
                  const colorClasses = [
                    'bg-purple-100 text-purple-800', // Morado
                    'bg-blue-100 text-blue-800', // Azul
                    'bg-orange-100 text-orange-800', // Naranja
                    'bg-gray-100 text-gray-800' // Gris
                  ];
                  return colorClasses[index % colorClasses.length];
                };

                return (
                  <div key={item.name} className='flex items-center gap-1'>
                    <Badge
                      variant='outline'
                      className={`${getColorClass(
                        index
                      )} text-xs font-semibold px-2 py-0.5`}
                    >
                      {item.name}: {item.value}
                    </Badge>
                    <span className='text-xs text-muted-foreground'>
                      ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent
        className='p-2 pt-0'
        style={{ height: processedHeight, flexGrow: 0 }}
      >
        <div className='w-full h-full relative'>
          <canvas
            ref={chartRef}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />

          {!hasData && (
            <div className='absolute inset-0 flex h-full w-full items-center justify-center'>
              <p className='text-muted-foreground text-xs'>
                No hay datos disponibles
              </p>
            </div>
          )}

          {hasSampleData && (
            <div className='absolute top-0 right-0 m-2'>
              <Badge
                variant='outline'
                className='bg-amber-100 text-amber-800 text-xs'
              >
                Datos de muestra
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
