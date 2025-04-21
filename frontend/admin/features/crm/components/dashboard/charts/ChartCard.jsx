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
  height = '280px'
}) => {
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className='py-2 flex-shrink-0'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <CardDescription className='text-xs'>{description}</CardDescription>
      </CardHeader>
      <CardContent className='p-2 flex-grow flex flex-col'>
        <div
          className='w-full relative flex-grow'
          style={{
            height: height === '100%' ? '100%' : height,
            minHeight: height === '100%' ? '200px' : height
          }}
        >
          <canvas ref={chartRef} className='w-full h-full' />
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
