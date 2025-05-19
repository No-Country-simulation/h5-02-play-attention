import { Card, CardContent } from '@/shared/ui/card';

/**
 * Componente para mostrar métricas individuales en una tarjeta
 * @param {string} title - Título de la métrica
 * @param {number|string} value - Valor numérico de la métrica
 * @param {ReactNode} icon - Icono que representa la métrica
 * @param {string} description - Descripción adicional de la métrica
 */
export const MetricCard = ({ title, value, icon, description }) => {
  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>{title}</p>
            <p className='text-3xl font-bold mt-1'>{value}</p>
            <p className='text-xs text-muted-foreground mt-1'>{description}</p>
          </div>
          <div className='bg-primary/10 p-2 rounded-full'>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};
